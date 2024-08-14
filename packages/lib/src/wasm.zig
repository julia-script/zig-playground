const std = @import("std");
const host = @import("host.zig");

pub const gpa = host.gpa;
extern fn logError(i32) void;

pub fn throw(message: []const u8) noreturn {
    host.hostThrow(message.ptr, message.len);
}

pub fn writeLog(message: []const u8) void {
    host.hostWrite(message.ptr, message.len);
}

pub fn panic(message: []const u8, _: ?*std.builtin.StackTrace, _: ?usize) noreturn {
    throw(message);
}

const Writer = struct {
    pub const Error: type = anyerror;

    pub fn writeBytesNTimes(_: *const Writer, value: []const u8, count: usize) !void {
        for (0..count) |_| {
            writeLog(value);
        }
    }
    pub fn writeAll(self: *const Writer, value: []const u8) !void {
        writeLog(value);
        _ = self;
    }
};
pub const writer = Writer{};

pub fn print(
    comptime fmt: []const u8,
    args: anytype,
) void {
    std.fmt.format(writer, fmt, args) catch @panic("failed to format");
}

pub fn println(
    comptime fmt: []const u8,
    args: anytype,
) void {
    print(fmt ++ "\n", args);
}
