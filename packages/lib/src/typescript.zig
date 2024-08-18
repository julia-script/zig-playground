const std = @import("std");
const Type = std.builtin.Type;
const Diagnostic = @import("exports.zig").Diagnostic;

pub fn formatTsType(writer: std.ArrayList(u8).Writer, T: type, comptime field: ?[]const u8) !void {
    if (field) |f| {
        if (!@hasDecl(T, f)) {
            const err = std.fmt.comptimePrint("Type {any} does not have decl {s}", .{ T, f });
            @compileError(err);
        }
        try writer.print("export type {s} = ", .{try formatTypeName(T, f)});
        try formatTsType(writer, @field(T, f), null);
        _ = try writer.write(";\n");
        return;
    }
    switch (@typeInfo(T)) {
        .Enum => |type_info| {
            try formatTsEnum(writer, type_info, try formatTypeName(T, null));
        },
        .Struct => |type_info| {
            try formatTsStruct(writer, type_info, try formatTypeName(T, null));
        },
        else => {
            try formatFieldValue(writer, T, 0);
        },
    }
}

pub inline fn formatTypeName(T: type, comptime name: ?[]const u8) ![]const u8 {
    var buff = try std.BoundedArray(u8, 256).init(0);
    const writer = buff.writer();
    var i: usize = 0;
    const str = @typeName(T) ++ if (name) |n| "." ++ n else "";
    while (i < str.len) : (i += 1) {
        if (str[i] == '.' and std.ascii.isUpper(str[i + 1])) {
            i += 1;
            while (i < str.len) : (i += 1) {
                if (str[i] == '.') continue;
                try writer.writeByte(str[i]);
                // buff.appendAssumeCapacity(str[i]);
            }
        }
    }
    // const final = buf.buffer[0..buf.len].*;
    return buff.constSlice();
}
pub fn toUpperCamelCase(writer: std.ArrayList(u8).Writer, str: []const u8) !void {
    var i: usize = 0;
    try writer.writeByte(std.ascii.toUpper(str[i]));
    i += 1;
    while (i < str.len) : (i += 1) {
        if (str[i] == '_') {
            i += 1;
            if (i < str.len) {
                _ = try writer.writeByte(std.ascii.toUpper(str[i]));
            }
        } else {
            _ = try writer.writeByte(str[i]);
        }
    }
}
pub fn formatTsEnum(writer: std.ArrayList(u8).Writer, type_info: Type.Enum, name: []const u8) !void {
    @setEvalBranchQuota(4000);
    try writer.print("export enum {s} {{\n", .{name});
    inline for (type_info.fields) |field| {
        _ = try writer.write("  ");
        try toUpperCamelCase(writer, field.name);
        _ = try writer.print(" = {d},\n", .{field.value});
    }

    _ = try writer.write("};\n");

    try writer.print("export const {[name]s}Map:Record<{[name]s}, string> = {{\n", .{ .name = name });

    inline for (type_info.fields) |field| {
        _ = try writer.print("  [{s}.", .{name});
        try toUpperCamelCase(writer, field.name);
        try writer.print("]: \"{s}\",\n", .{field.name});
    }
    _ = try writer.write("};\n");
}
pub fn formatTsStructValue(writer: std.ArrayList(u8).Writer, type_info: Type.Struct, indent: usize) !void {
    try writer.print("{{\n", .{});
    inline for (type_info.fields) |field| {
        _ = try writer.writeBytesNTimes("  ", indent + 1);
        try writer.print("{s}: ", .{field.name});
        try formatFieldValue(writer, field.type, indent + 1);
        try writer.print(",\n", .{});
    }
    _ = try writer.writeBytesNTimes("  ", indent);
    _ = try writer.write("}");
}
pub fn formatFieldValue(writer: std.ArrayList(u8).Writer, T: type, indent: usize) !void {
    switch (@typeInfo(T)) {
        .Int, .ComptimeInt, .Float, .ComptimeFloat => {
            _ = try writer.write("number");
        },
        .Bool => {
            _ = try writer.write("boolean");
        },

        .Struct => |struct_type_info| {
            try formatTsStructValue(
                writer,
                struct_type_info,
                indent,
            );
        },
        .Optional => |optional| {
            try writer.print("null | ", .{});
            try formatFieldValue(writer, optional.child, indent);
        },

        .Pointer => |pointer| {
            if (pointer.child == u8) {
                _ = try writer.write("string");
                return;
            }
            try writer.print("Array<", .{});
            try formatFieldValue(writer, pointer.child, indent);
            try writer.print(">", .{});
            // field_type_info = @typeInfo(pointer.child);
        },
        .Void => {
            _ = try writer.write("void");
        },
        .Enum => {
            const name = try formatTypeName(T, null);
            _ = try writer.write(name);
        },
        else => |info| {
            const err = std.fmt.comptimePrint("Unsupported type: {s} {any}", .{ @tagName(info), T });
            @compileError(err);
        },
    }
}
pub fn formatTsStruct(writer: std.ArrayList(u8).Writer, type_info: Type.Struct, name: []const u8) !void {
    try writer.print("export type {s} = ", .{name});
    try formatTsStructValue(writer, type_info, 0);
    _ = try writer.write(";\n");
}
pub inline fn formatExports(writer: std.ArrayList(u8).Writer, comptime T: type) !void {
    @setEvalBranchQuota(2000);
    const type_info = @typeInfo(T).Struct;

    try writer.print("export type Exports = {{\n", .{});
    inline for (type_info.decls) |decl| {
        const field_type = @typeInfo(@TypeOf(@field(T, decl.name)));

        switch (field_type) {
            .Fn => |fun| {
                _ = try writer.writeBytesNTimes("  ", 1);
                try writer.print("{s}: (", .{decl.name});

                inline for (fun.params, 0..) |param, i| {
                    if (i > 0) try writer.print(", ", .{});
                    try writer.print("arg_{d}: ", .{i});
                    const param_type = param.type orelse {
                        const err = std.fmt.comptimePrint("Missing type for param {d}", .{i});
                        @compileError(err);
                    };

                    switch (@typeInfo(param_type)) {
                        .Void => {
                            try writer.print("void", .{});
                        },
                        .Pointer, .Int => {
                            try writer.print("number", .{});
                        },
                        else => {
                            const err = std.fmt.comptimePrint("Unsupported param type: {s}", .{@tagName(@typeInfo(param_type))});
                            @compileError(err);
                        },
                    }
                }
                try writer.print(") => ", .{});

                const return_type = fun.return_type orelse void;
                switch (@typeInfo(return_type)) {
                    .Void => {
                        try writer.print("void", .{});
                    },
                    .Pointer, .Int => {
                        try writer.print("number", .{});
                    },
                    else => {
                        const err = std.fmt.comptimePrint("Unsupported return type: {s}", .{@tagName(@typeInfo(return_type))});
                        @compileError(err);
                    },
                }
                _ = try writer.write(";\n");
            },
            else => {},
        }

        // try formatFieldValue(writer, @typeInfo(decl.type), 0);
    }
    try writer.print("}};\n", .{});
}

const Node = std.zig.Ast.Node;
pub fn genFinalTypes(allocator: std.mem.Allocator) !std.ArrayList(u8) {
    var content = std.ArrayList(u8).init(allocator);
    const writer = content.writer();
    try formatTsType(writer, std.zig.Ast, "TokenIndex");
    try formatTsType(writer, std.zig.Ast.Node, "Index");
    try writer.print("\n", .{});

    try formatTsType(writer, std.zig.Token.Tag, null);
    try writer.print("\n", .{});

    try formatTsType(writer, std.zig.Ast.Node.Tag, null);
    try writer.print("\n", .{});

    try formatTsType(writer, std.zig.Ast.Span, null);
    try writer.print("\n", .{});

    try formatTsType(writer, std.zig.Zir.Inst.Tag, null);
    try writer.print("\n", .{});

    try formatTsType(writer, Diagnostic, null);
    try writer.print("\n", .{});

    // ExtraData types
    try formatTsType(writer, Node.ArrayTypeSentinel, null);
    try formatTsType(writer, Node.Asm, null);
    try formatTsType(writer, Node.ContainerField, null);
    try formatTsType(writer, Node.FnProto, null);
    try formatTsType(writer, Node.FnProtoOne, null);
    try formatTsType(writer, Node.GlobalVarDecl, null);
    try formatTsType(writer, Node.If, null);
    try formatTsType(writer, Node.LocalVarDecl, null);
    try formatTsType(writer, Node.PtrType, null);
    try formatTsType(writer, Node.PtrTypeBitRange, null);
    try formatTsType(writer, Node.Slice, null);
    try formatTsType(writer, Node.SliceSentinel, null);
    try formatTsType(writer, Node.SubRange, null);
    try formatTsType(writer, Node.While, null);
    try formatTsType(writer, Node.WhileCont, null);
    try writer.print("\n", .{});

    const full = std.zig.Ast.full;
    try formatTsType(writer, std.builtin.Type.Pointer.Size, null);

    try formatTsType(writer, full.ArrayInit, null);
    try formatTsType(writer, full.ArrayType, null);
    try formatTsType(writer, full.Asm, null);
    try formatTsType(writer, full.Call, null);
    try formatTsType(writer, full.ContainerDecl, null);
    try formatTsType(writer, full.ContainerField, null);
    try formatTsType(writer, full.FnProto, null);
    try formatTsType(writer, full.For, null);
    try formatTsType(writer, full.If, null);
    try formatTsType(writer, full.PtrType, null);
    try formatTsType(writer, full.Slice, null);
    try formatTsType(writer, full.StructInit, null);
    try formatTsType(writer, full.SwitchCase, null);
    try formatTsType(writer, full.VarDecl, null);
    try formatTsType(writer, full.While, null);
    try formatTsType(writer, full.AssignDestructure, null);
    try writer.print("\n", .{});

    const T = @import("exports.zig");
    try formatExports(writer, T);
    return content;
}
const test_allocator = std.testing.allocator;
test "formatTsType" {
    // var buf = std.ArrayList(u8).init(test_allocator);
    var contents = try genFinalTypes(test_allocator);

    defer contents.deinit();
    // std.debug.print("{s}\n", .{contents.items});

    // defer buf.deinit();
    // const writer = buf.writer();
    // // try formatTsType(writer, std.zig.Token.Tag, null);
    // // try formatTsType(writer, std.zig.Ast, "TokenIndex");
    // const Example = struct {
    //     hi: []const u8,
    //     b: struct {
    //         a: ?u8,
    //         c: ?[]const u8,
    //         d: struct {
    //             e: ?u8,
    //         },
    //     },
    //     pub export fn foo(a: std.zig.Ast.TokenIndex) [*]const u8 {
    //         _ = a; // autofix
    //         std.debug.print("hi\n", .{});
    //         return " ";
    //     }
    // };
    // try formatTsType(writer, Example, null);
    // try formatExports(writer, Example);
}
