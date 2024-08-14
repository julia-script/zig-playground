const std = @import("std");
const fs = std.fs;

const File = @This();

allocator: std.mem.Allocator,
contents: []u8,

pub fn openDir(dir: []const u8, flags: fs.Dir.OpenDirOptions) !fs.Dir {
    if (fs.path.isAbsolute(dir)) {
        return try fs.openDirAbsolute(dir, flags);
    }
    return try fs.cwd().openDir(dir, flags);
}

pub fn openFile(file_path: []const u8) !fs.File {
    if (fs.path.isAbsolute(file_path)) {
        return try fs.openFileAbsolute(file_path, .{});
    }
    return try fs.cwd().openFile(file_path, .{});
}

pub fn read(allocator: std.mem.Allocator, path: []const u8) !File {
    const file = try File.openFile(path);
    defer file.close();

    const stats = try file.stat();
    const contents = try file.reader().readAllAlloc(allocator, stats.size);

    return .{
        .allocator = allocator,
        .contents = contents,
    };
}

pub fn join(allocator: std.mem.Allocator, parts: anytype) !File {
    var contents = std.ArrayList(u8).init(allocator, 0);
    inline for (parts) |part| {
        contents.appendSlice(part);
    }

    return .{
        .allocator = allocator,
        .contents = contents.toOwnedSlice(),
    };
}

pub fn dirStat(out_dir: []const u8) !fs.Dir.Stat {
    var dir = try openDir(out_dir, .{});
    defer dir.close();
    return dir.stat();
}

pub fn readDirEntries(allocator: std.mem.Allocator, out_dir: []const u8) !std.ArrayList(fs.Dir.Entry) {
    var dir = try openDir(out_dir, .{ .iterate = true });
    defer dir.close();
    var iterator = dir.iterate();
    var entries = std.ArrayList(fs.Dir.Entry).init(allocator);
    errdefer entries.deinit();

    while (try iterator.next()) |entry| {
        try entries.append(entry);
    }

    return entries;
}

// pub fn readDir(out_dir: []const u8) !fs.Dir.Entry {
//     var dir = try openDir(out_dir, .{ .iterate = true });
//     defer dir.close();
//     return dir.read();
// }
pub fn fileStat(out_file: []const u8) !fs.File.Stat {
    var file = try openFile(out_file);
    defer file.close();
    return file.stat();
}

pub fn deinit(self: *File) void {
    self.allocator.free(self.contents);
}
