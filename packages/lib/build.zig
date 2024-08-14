const std = @import("std");
const JsBase64Step = @import("build-utils/JsBase64.zig");
// const GenTypesStep = @import("build-utils/GenTypes.zig");
const genTypes = @import("src/typescript.zig").genFinalTypes;

pub inline fn queue(steps: anytype) void {
    var prev: *std.Build.Step = @constCast(steps[0]);
    inline for (1..steps.len) |i| {
        steps[i].dependOn(prev);
        prev = @constCast(steps[i]);
    }
}
pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // const lib = b.addStaticLibrary(.{
    //     .name = "zig-devkit",
    //     .root_source_file = b.path("src/root.zig"),
    //     .target = target,
    //     .optimize = optimize,
    // });
    //
    // const exe = b.addExecutable(.{
    //     .name = "zig-devkit",
    //     .root_source_file = b.path("src/main.zig"),
    //     .target = target,
    //     .optimize = optimize,
    // });
    // b.installArtifact(exe);

    // const run_cmd = b.addRunArtifact(exe);
    // run_cmd.step.dependOn(b.getInstallStep());

    // if (b.args) |args| {
    //     run_cmd.addArgs(args);
    // }

    // const run_step = b.step("run", "Run the app");
    // run_step.dependOn(&run_cmd.step);

    const lib_unit_tests = b.addTest(.{
        .root_source_file = b.path("src/exports.zig"),
        .target = target,
        .optimize = optimize,
    });
    const run_lib_unit_tests = b.addRunArtifact(lib_unit_tests);

    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_lib_unit_tests.step);

    const wasm_name = "zig-devkit-wasm";
    const wasm_exe = b.addExecutable(.{
        .name = wasm_name,
        .root_source_file = b.path("src/exports.zig"),
        .target = b.resolveTargetQuery(.{
            .cpu_arch = .wasm32,
            .os_tag = .freestanding,
        }),
        .optimize = optimize: {
            // Wasm does not support debug info
            if (optimize == .Debug) {
                break :optimize .ReleaseSmall;
            }
            break :optimize optimize;
        },

        .unwind_tables = true,
    });

    wasm_exe.entry = .disabled;
    wasm_exe.export_table = true;
    wasm_exe.rdynamic = true;
    wasm_exe.import_memory = true;

    const install_wasm = b.addInstallArtifact(wasm_exe, .{});
    var wasm_to_wat = b.addSystemCommand(&.{"wasm2wat"});
    wasm_to_wat.addArtifactArg(install_wasm.artifact);

    var wasm_to_js = b.addSystemCommand(&.{
        "wasm2es6js",
        "--base64",
        "--typescript",
        "--out-dir",
    });
    const wasm_to_js_output = wasm_to_js.addOutputDirectoryArg("bin/js");
    wasm_to_js.addArtifactArg(install_wasm.artifact);

    const save_js = b.addInstallDirectory(.{
        .source_dir = wasm_to_js_output,
        .install_dir = .{ .bin = {} },
        .install_subdir = "",
    });
    _ = save_js; // autofix

    const stdout = wasm_to_wat.captureStdOut();
    const save_wat = b.addInstallFile(stdout, "bin/" ++ wasm_name ++ ".wat");

    const wasm_base64 = try JsBase64Step.create(b, wasm_exe);
    const wasm_install_base64 = b.addInstallFile(wasm_base64.getOutput(), "bin/" ++ wasm_name ++ "-base64.ts");

    // const wasm_types = try GenTypesStep.create(b, wasm_exe);
    // const wasm_install_types = b.addInstallFile(wasm_types.getOutput(), "bin/" ++ wasm_name ++ "-types.ts");
    // _ = wasm_install_types; // autofix

    const ts_types = genTypes(b.allocator) catch {
        @panic("Failed to generate typescript types");
    };

    const write_ts_types = b.addWriteFile("types.ts", ts_types.items);
    const install_ts_types = b.addInstallDirectory(
        .{
            .source_dir = write_ts_types.getDirectory(),
            .install_dir = .{ .bin = {} },
            .install_subdir = "",
        },
    );

    b.installDirectory(.{
        .source_dir = wasm_exe.getEmittedIncludeTree(),
        .install_dir = .prefix,
        .install_subdir = "docs",
    });

    queue(.{
        &wasm_exe.step,
        &install_wasm.step,

        &wasm_base64.step,
        &wasm_install_base64.step,

        &wasm_to_wat.step,
        &save_wat.step,

        &write_ts_types.step,
        &install_ts_types.step,
        // &wasm_types.step,
        // &wasm_install_types.step,

        // &wasm_to_js.step,
        // &save_js.step,
        b.step("wasm", "Build the WebAssembly module"),
    });
}
