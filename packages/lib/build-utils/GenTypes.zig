const std = @import("std");
const File = @import("file.zig");
const Step = std.Build.Step;
const fs = std.fs;
const LazyPath = std.Build.LazyPath;

const GeneratedFile = std.Build.GeneratedFile;

pub const base_id = .custom;

const WasmTypes = @This();

step: Step,
bin_path: LazyPath,
generated_file: GeneratedFile,
bin_step: *Step.Compile,
const basename = "types.ts";

// pub fn pipeSteps(steps: anytype) void {
//     var prev_step: ?*Step = null;
//     inline for (steps) |step| {
//         if (prev_step) |p| {
//             step.dependOn(p);
//         }
//         prev_step = step;
//     }
// }

pub fn create(owner: *std.Build, bin_step: *Step.Compile) !*WasmTypes {
    const self = owner.allocator.create(WasmTypes) catch @panic("OOM");
    self.* = .{
        .step = Step.init(.{
            .id = .custom,
            .name = "Gen wasm types",
            .owner = owner,
            .makeFn = make,
        }),
        .bin_step = bin_step,
        .bin_path = bin_step.getEmittedBin(),
        .generated_file = undefined,
    };
    self.generated_file = .{ .step = &self.step };

    self.step.dependOn(&bin_step.step);
    return self;
}
pub fn getOutput(self: *WasmTypes) LazyPath {
    return .{
        .generated = .{
            .file = &self.generated_file,
        },
    };
}

pub fn addInstall(self: *WasmTypes) *std.Build.Step.InstallFile {
    const b = self.step.owner;
    return b.addInstallFile(self.getOutput(), "bin" ++ std.fs.path.sep_str ++ basename);
}

fn getPath(self: *WasmTypes) ![]const u8 {
    if (self.generated_file.path) |path| {
        return path;
    }
    const b = self.step.owner;
    const bin_resolved_path = self.bin_path.getPath(b);

    var hash = b.graph.cache.hash;
    hash.add(self.bin_step.step.result_cached);
    hash.add(@as(u32, 0xad95e922));
    // hash.add(rand_int);

    // hash.add(
    hash.addBytes(bin_resolved_path);
    const sub_path = "c" ++ fs.path.sep_str ++ hash.final() ++ fs.path.sep_str ++ basename;
    self.generated_file.path = try b.cache_root.join(b.allocator, &.{sub_path});
    return self.generated_file.path.?;
}
fn make(step: *Step, make_options: Step.MakeOptions) !void {
    _ = make_options; // autofix
    //
    const b = step.owner;
    const self: *WasmTypes = @fieldParentPtr("step", step);
    const sub_path = try self.getPath();

    if (b.cache_root.handle.access(sub_path, .{})) |_| {
        step.result_cached = true;
        return;
    } else |outer_err| switch (outer_err) {
        error.FileNotFound => {
            const sub_dirname = fs.path.dirname(sub_path).?;
            b.cache_root.handle.makePath(sub_dirname) catch |e| {
                return step.fail("unable to make path '{}{s}': {s}", .{
                    b.cache_root, sub_dirname, @errorName(e),
                });
            };

            var bin_file = try File.read(b.allocator, self.bin_path.getPath(b));
            defer bin_file.deinit();

            const buffer = try self.createFile(b);
            defer buffer.deinit();
            // //Uint8Array.from(atob(base64_string), c => c.charCodeAt(0))
            //
            // try buffer.appendSlice("export default Uint8Array.from(atob(\"");
            //
            // try buffer.ensureUnusedCapacity(encoded_size);
            // const old_len = buffer.items.len;
            // buffer.items.len += encoded_size;
            // _ = std.base64.standard.Encoder.encode(buffer.items[old_len..], bin_file.contents);
            //
            // try buffer.appendSlice("\"), c => c.charCodeAt(0))");

            const rand_int = std.crypto.random.int(u64);
            const tmp_sub_path = "tmp" ++ fs.path.sep_str ++
                std.Build.hex64(rand_int) ++ fs.path.sep_str ++
                basename;

            const tmp_sub_path_dirname = fs.path.dirname(tmp_sub_path).?;

            b.cache_root.handle.makePath(tmp_sub_path_dirname) catch |err| {
                return step.fail("unable to make temporary directory '{}{s}': {s}", .{
                    b.cache_root, tmp_sub_path_dirname, @errorName(err),
                });
            };
            b.cache_root.handle.writeFile(.{
                .sub_path = tmp_sub_path,
                .data = buffer.items,
            }) catch |err| {
                return step.fail("unable to write options to '{}{s}': {s}", .{
                    b.cache_root, tmp_sub_path, @errorName(err),
                });
            };
            b.cache_root.handle.rename(tmp_sub_path, sub_path) catch |err| switch (err) {
                error.PathAlreadyExists => {
                    // Other process beat us to it. Clean up the temp file.
                    b.cache_root.handle.deleteFile(tmp_sub_path) catch |e| {
                        try step.addError("warning: unable to delete temp file '{}{s}': {s}", .{
                            b.cache_root, tmp_sub_path, @errorName(e),
                        });
                    };
                    step.result_cached = true;
                    return;
                },
                else => {
                    return step.fail("unable to rename options from '{}{s}' to '{}{s}': {s}", .{
                        b.cache_root,    tmp_sub_path,
                        b.cache_root,    sub_path,
                        @errorName(err),
                    });
                },
            };
        },
        else => |e| return step.fail("unable to access options file '{}{s}': {s}", .{
            b.cache_root, sub_path, @errorName(e),
        }),
    }
}

pub fn createFile(self: *WasmTypes, b: *std.Build) !std.ArrayList(u8) {
    var buffer = std.ArrayList(u8).init(self.step.owner.allocator);
    const root_file = self.bin_step.root_module.root_source_file orelse return error.NoRootSourceFile;
    const root_path = root_file.getPath3(b, &self.step);
    const root_path_abs = b.pathFromRoot(root_path.sub_path);
    const content = try b.cache_root.handle.readFileAllocOptions(
        b.allocator,
        root_path_abs,
        1024 * 1024,
        null,
        @alignOf(u8),
        0,
    );
    // buffer.toOwnedSliceSentinel(comptime sentinel: T)
    const ast = try std.zig.Ast.parse(b.allocator, content, .zig);
    const zir = try std.zig.AstGen.generate(b.allocator, ast);
    // const root_decl = zir.instructions.get(0).data.extended;
    var decl_iter = zir.declIterator(std.zig.Zir.Inst.Index.main_struct_inst);
    while (decl_iter.next()) |decl| {
        const data = zir.instructions.items(.data)[@intFromEnum(decl)].declaration;
        const extra_data_raw = zir.extraData(std.zig.Zir.Inst.Declaration, data.payload_index);
        const extra_data: std.zig.Zir.Inst.Declaration = extra_data_raw.data;

        if (!extra_data.flags.is_export) continue;
        const bodies = extra_data.getBodies(@intCast(extra_data_raw.end), zir);
        const value_inst = bodies.value_body[0];
        // const fn_info = zir.getFnInfo(value_inst);
        std.debug.print("root_decl: {any}\n", .{zir.instructions.items(.tag)[@intFromEnum(value_inst)]});
        // std.debug.print("bodies: {any}\n", .{fn_info});
    }

    // b.build_root.   // root_path.resolv
    // const     b.build_root()
    try buffer.appendSlice(content);
    // const file_path = root_file.getPath3(b, null);
    // try buffer.appendSlice(file_path.sub_path);
    // @compileLog(self.root_module.root_source_file);
    // const b = self.step.owner;
    // const path = try self.getPath();
    // const file = try writer.create
    return buffer;
}
