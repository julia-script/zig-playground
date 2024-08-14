const std = @import("std");
const File = @import("file.zig");
const Step = std.Build.Step;
const fs = std.fs;
const LazyPath = std.Build.LazyPath;

const GeneratedFile = std.Build.GeneratedFile;

pub const base_id = .custom;

const JsBase64 = @This();

step: Step,
bin_path: LazyPath,
generated_file: GeneratedFile,
const basename = "bento-base64.js";

// pub fn pipeSteps(steps: anytype) void {
//     var prev_step: ?*Step = null;
//     inline for (steps) |step| {
//         if (prev_step) |p| {
//             step.dependOn(p);
//         }
//         prev_step = step;
//     }
// }

pub fn create(owner: *std.Build, bin_step: *Step.Compile) !*JsBase64 {
    const self = owner.allocator.create(JsBase64) catch @panic("OOM");
    self.* = .{
        .step = Step.init(.{
            .id = .custom,
            .name = "Bin to Js Base64",
            .owner = owner,
            .makeFn = make,
        }),
        .bin_path = bin_step.getEmittedBin(),
        .generated_file = undefined,
    };
    self.generated_file = .{ .step = &self.step };

    self.step.dependOn(&bin_step.step);
    return self;
}
pub fn getOutput(self: *JsBase64) LazyPath {
    return .{
        .generated = .{
            .file = &self.generated_file,
        },
    };
}

pub fn addInstall(self: *JsBase64) *std.Build.Step.InstallFile {
    const b = self.step.owner;
    return b.addInstallFile(self.getOutput(), "bin" ++ std.fs.path.sep_str ++ basename);
}

fn getPath(self: *JsBase64) ![]const u8 {
    if (self.generated_file.path) |path| {
        return path;
    }
    const b = self.step.owner;
    const bin_resolved_path = self.bin_path.getPath(b);

    var hash = b.graph.cache.hash;
    hash.add(@as(u32, 0xad95e922));
    hash.addBytes(bin_resolved_path);
    const sub_path = "c" ++ fs.path.sep_str ++ hash.final() ++ fs.path.sep_str ++ basename;
    self.generated_file.path = try b.cache_root.join(b.allocator, &.{sub_path});
    return self.generated_file.path.?;
}
fn make(step: *Step, make_options: Step.MakeOptions) !void {
    _ = make_options; // autofix
    const b = step.owner;
    const self: *JsBase64 = @fieldParentPtr("step", step);
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

            const encoder = std.base64.standard.Encoder;

            const encoded_size = encoder.calcSize(bin_file.contents.len);

            var buffer = std.ArrayList(u8).init(b.allocator);
            defer buffer.deinit();
            //Uint8Array.from(atob(base64_string), c => c.charCodeAt(0))

            try buffer.appendSlice("export default Uint8Array.from(atob(\"");

            try buffer.ensureUnusedCapacity(encoded_size);
            const old_len = buffer.items.len;
            buffer.items.len += encoded_size;
            _ = std.base64.standard.Encoder.encode(buffer.items[old_len..], bin_file.contents);

            try buffer.appendSlice("\"), c => c.charCodeAt(0))");

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
