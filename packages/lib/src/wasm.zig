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

// const Writer_ = struct {
//     pub const Error: type = anyerror;
//
//     pub fn writeBytesNTimes(_: *const Writer_, value: []const u8, count: usize) !void {
//         for (0..count) |_| {
//             writeLog(value);
//         }
//     }
//     pub fn writeAll(self: *const Writer_, value: []const u8) !void {
//         writeLog(value);
//         _ = self;
//     }
// };
//
// pub const writer = wasm_writer.writer();

pub const WriterError = error{};
pub const WasmWriter = struct {
    pub const Error = WriterError;
    pub const Writer = std.io.Writer(*Self, Error, write);

    const Self = @This();

    // pub fn flush(self: *Self) !void {
    //     _ = self; // autofix
    //     // try self.unbuffered_writer.writeAll(self.buf[0..self.end]);
    //     // self.end = 0;
    // }
    pub fn writer(self: *Self) Writer {
        return .{ .context = self };
    }

    pub fn write(self: *Self, bytes: []const u8) Error!usize {
        _ = self; // autofix
        writeLog(bytes);
        // if (self.end + bytes.len > self.buf.len) {
        //     try self.flush();
        //     if (bytes.len > self.buf.len)
        //         return self.unbuffered_writer.write(bytes);
        // }
        //
        // const new_end = self.end + bytes.len;
        // @memcpy(self.buf[self.end..new_end], bytes);
        // self.end = new_end;
        // return bytes.len;
        return bytes.len;
    }
};

// pub const generic_writer = std.fs.File.Writer(writer);
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
