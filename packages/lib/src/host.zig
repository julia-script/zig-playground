const builtin = @import("builtin");
const std = @import("std");

var general_purpose_allocator = std.heap.GeneralPurposeAllocator(.{}){};
pub usingnamespace if (builtin.target.isWasm()) struct {
    pub extern fn hostThrow(pointer: [*]const u8, length: usize) noreturn;
    pub extern fn hostWrite(message: [*]const u8, length: usize) void;
    pub const gpa = general_purpose_allocator.allocator();
} else struct {
    pub const gpa = if (builtin.is_test) std.testing.allocator else general_purpose_allocator.allocator();
    pub fn hostThrow(_: [*]const u8, _: usize) noreturn {
        @panic("hostThrow not implemented");
    }
    pub fn hostWrite(_: [*]const u8, _: usize) void {
        @panic("hostWrite not implemented");
    }
};
