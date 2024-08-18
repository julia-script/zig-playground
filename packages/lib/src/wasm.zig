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

pub const WriterError = error{};
pub const WasmWriter = struct {
    pub const Error = WriterError;
    pub const Writer = std.io.Writer(*Self, Error, write);

    const Self = @This();
    pub fn writer(self: *Self) Writer {
        return .{ .context = self };
    }

    pub fn write(self: *Self, bytes: []const u8) Error!usize {
        _ = self; // autofix
        writeLog(bytes);
        return bytes.len;
    }
};

pub fn print(
    comptime fmt: []const u8,
    args: anytype,
) void {
    var writer = WasmWriter{};
    std.fmt.format(writer.writer(), fmt, args) catch @panic("failed to format");
}

pub fn println(
    comptime fmt: []const u8,
    args: anytype,
) void {
    print(fmt ++ "\n", args);
}
