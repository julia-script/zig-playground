const std = @import("std");
const wasm = @import("wasm.zig");
const Ast = std.zig.Ast;
fn panic(message: []const u8, _: ?*std.builtin.StackTrace, _: ?usize) noreturn {
    wasm.throw(message);
}

pub export fn wasmAlloc(len: usize) [*]u8 {
    const buf = wasm.gpa.alloc(u8, len) catch {
        @panic("failed to allocate memory");
    };
    return buf.ptr;
}

pub export fn wasmAllocZ(len: usize) [*:0]u8 {
    const buf = wasm.gpa.allocSentinel(u8, len, 0) catch {
        @panic("failed to allocate memory");
    };
    return buf.ptr;
}
pub export fn wasmFree(ptr: usize, length: usize) void {
    const slice = @as([*]u8, @ptrFromInt(ptr));
    wasm.gpa.free(slice[0..length]);
}

pub export fn wasmFreeU8Z(ptr: usize, length: usize) void {
    wasm.gpa.free(@as([*]u8, @ptrFromInt(ptr))[0..length :0]);
}

pub export fn wasmFreeU32Z(ptr: usize, length: usize) void {
    wasm.gpa.free(@as([*]u32, @ptrFromInt(ptr))[0..length :0]);
}
fn wasmCreate(T: type) *T {
    return wasm.gpa.create(T) catch {
        @panic("failed to create object");
    };
}

fn wasmDestroy(ptr: anytype) void {
    wasm.gpa.destroy(ptr);
}

pub export fn destroyAst(ast: *Ast) void {
    wasm.gpa.free(ast.source);
    ast.deinit(wasm.gpa);
    wasmDestroy(ast);
}

pub export fn parseAstFromSource(source: [*:0]u8, len: usize) *Ast {
    const ast = wasmCreate(Ast);
    ast.* = Ast.parse(wasm.gpa, source[0..len :0], .zig) catch {
        @panic("failed to parse source");
    };
    return ast;
}

pub export fn getNodesLength(ast: *Ast) u64 {
    return ast.nodes.len;
}

pub export fn getTokensLength(ast: *Ast) u64 {
    return ast.tokens.len;
}

pub export fn getTokenTag(ast: *Ast, token: u32) u32 {
    return @intFromEnum(ast.tokens.items(.tag)[token]);
}

pub export fn getTokenStart(ast: *Ast, token: u32) u32 {
    return ast.tokens.items(.start)[token];
}
pub export fn getMainToken(ast: *Ast, node: Ast.Node.Index) u32 {
    return ast.nodes.items(.main_token)[node];
}
pub export fn getNodeData(ast: *Ast, node: Ast.Node.Index) [*:0]const u32 {
    const data = ast.nodes.items(.data)[node];

    return wasmDupeZ(u32, &.{
        data.lhs,
        data.rhs,
    });
}

pub export fn getExtraDataSpan(ast: *Ast, lhs: u32, rhs: u32) [*:0]const u32 {
    const extra_data = ast.extra_data[lhs..rhs];
    return wasmDupeZ(u32, extra_data);
}

const Node = Ast.Node;

pub export fn getNodeExtraDataArrayTypeSentinel(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.extraData(
        node,
        Node.ArrayTypeSentinel,
    ));
}
pub export fn getNodeExtraDataAsm(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.extraData(
        node,
        Node.Asm,
    ));
}
pub export fn getNodeExtraDataContainerField(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.extraData(
        node,
        Node.ContainerField,
    ));
}
pub export fn getNodeExtraDataFnProto(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.extraData(
        node,
        Node.FnProto,
    ));
}
pub export fn getNodeExtraDataFnProtoOne(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.extraData(
        node,
        Node.FnProtoOne,
    ));
}
pub export fn getNodeExtraDataGlobalVarDecl(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.extraData(
        node,
        Node.GlobalVarDecl,
    ));
}
pub export fn getNodeExtraDataIf(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.extraData(
        node,
        Node.If,
    ));
}
pub export fn getNodeExtraDataLocalVarDecl(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.extraData(
        node,
        Node.LocalVarDecl,
    ));
}
pub export fn getNodeExtraDataPtrType(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.extraData(
        node,
        Node.PtrType,
    ));
}
pub export fn getNodeExtraDataPtrTypeBitRange(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.extraData(
        node,
        Node.PtrTypeBitRange,
    ));
}
pub export fn getNodeExtraDataSlice(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.extraData(
        node,
        Node.Slice,
    ));
}
pub export fn getNodeExtraDataSliceSentinel(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.extraData(
        node,
        Node.SliceSentinel,
    ));
}
pub export fn getNodeExtraDataSubRange(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.extraData(
        node,
        Node.SubRange,
    ));
}
pub export fn getNodeExtraDataWhile(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.extraData(
        node,
        Node.While,
    ));
}
pub export fn getNodeExtraDataWhileCont(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.extraData(
        node,
        Node.WhileCont,
    ));
}

pub export fn getNodeTag(ast: *Ast, node: Ast.Node.Index) u32 {
    return @intFromEnum(ast.nodes.items(.tag)[node]);
}
fn stringify(value: anytype) [:0]u8 {
    var str = std.ArrayList(u8).init(wasm.gpa);
    std.json.stringify(value, .{}, str.writer()) catch {
        @panic("failed to stringify value");
    };
    return str.toOwnedSliceSentinel(0) catch {
        @panic("failed to get string slice");
    };
}
// pub fn std.mem.concatMaybeSentinel(allocator: Allocator, comptime T: type, slices: []const []const T, comptime s: ?T)

// export fn getToken

// export fn getSerializedFull(ast: *Ast, node: Ast.Node.Index) void {
//     switch (ast.nodes.items(.tag)[node]) {
//         .root,
//         .@"usingnamespace",
//         .test_decl,
//         .global_var_decl,
//         .local_var_decl,
//         .simple_var_decl,
//         .aligned_var_decl,
//         .@"errdefer",
//         .@"defer",
//         .@"catch",
//         .field_access,
//         .unwrap_optional,
//         .equal_equal,
//         .bang_equal,
//         .less_than,
//         .greater_than,
//         .less_or_equal,
//         .greater_or_equal,
//         .assign_mul,
//         .assign_div,
//         .assign_mod,
//         .assign_add,
//         .assign_sub,
//         .assign_shl,
//         .assign_shl_sat,
//         .assign_shr,
//         .assign_bit_and,
//         .assign_bit_xor,
//         .assign_bit_or,
//         .assign_mul_wrap,
//         .assign_add_wrap,
//         .assign_sub_wrap,
//         .assign_mul_sat,
//         .assign_add_sat,
//         .assign_sub_sat,
//         .assign,
//         .assign_destructure,
//         .merge_error_sets,
//         .mul,
//         .div,
//         .mod,
//         .array_mult,
//         .mul_wrap,
//         .mul_sat,
//         .add,
//         .sub,
//         .array_cat,
//         .add_wrap,
//         .sub_wrap,
//         .add_sat,
//         .sub_sat,
//         .shl,
//         .shl_sat,
//         .shr,
//         .bit_and,
//         .bit_xor,
//         .bit_or,
//         .@"orelse",
//         .bool_and,
//         .bool_or,
//         .bool_not,
//         .negation,
//         .bit_not,
//         .negation_wrap,
//         .address_of,
//         .@"try",
//         .@"await",
//         .optional_type,
//         .array_type,
//         .array_type_sentinel,
//         .ptr_type_aligned,
//         .ptr_type_sentinel,
//         .ptr_type,
//         .ptr_type_bit_range,
//         .slice_open,
//         .slice,
//         .slice_sentinel,
//         .deref,
//         .array_access,
//         .array_init_one,
//         .array_init_one_comma,
//         .array_init_dot_two,
//         .array_init_dot_two_comma,
//         .array_init_dot,
//         .array_init_dot_comma,
//         .array_init,
//         .array_init_comma,
//         .struct_init_one,
//         .struct_init_one_comma,
//         .struct_init_dot_two,
//         .struct_init_dot_two_comma,
//         .struct_init_dot,
//         .struct_init_dot_comma,
//         .struct_init,
//         .struct_init_comma,
//         .call_one,
//         .call_one_comma,
//         .async_call_one,
//         .async_call_one_comma,
//         .call,
//         .call_comma,
//         .async_call,
//         .async_call_comma,
//         .@"switch",
//         .switch_comma,
//         .switch_case_one,
//         .switch_case_inline_one,
//         .switch_case,
//         .switch_case_inline,
//         .switch_range,
//         .while_simple,
//         .while_cont,
//         .@"while",
//         .for_simple,
//         .@"for",
//         .for_range,
//         .if_simple,
//         .@"if",
//         .@"suspend",
//         .@"resume",
//         .@"continue",
//         .@"break",
//         .@"return",
//         .fn_proto_simple,
//         .fn_proto_multi,
//         .fn_proto_one,
//         .fn_proto,
//         .fn_decl,
//         .anyframe_type,
//         .anyframe_literal,
//         .char_literal,
//         .number_literal,
//         .unreachable_literal,
//         .identifier,
//         .enum_literal,
//         .string_literal,
//         .multiline_string_literal,
//         .grouped_expression,
//         .builtin_call_two,
//         .builtin_call_two_comma,
//         .builtin_call,
//         .builtin_call_comma,
//         .error_set_decl,
//         .container_decl,
//         .container_decl_trailing,
//         .container_decl_two,
//         .container_decl_two_trailing,
//         .container_decl_arg,
//         .container_decl_arg_trailing,
//         .tagged_union,
//         .tagged_union_trailing,
//         .tagged_union_two,
//         .tagged_union_two_trailing,
//         .tagged_union_enum_tag,
//         .tagged_union_enum_tag_trailing,
//         .container_field_init,
//         .container_field_align,
//         .container_field,
//         .@"comptime",
//         .@"nosuspend",
//         .block_two,
//         .block_two_semicolon,
//         .block,
//         .block_semicolon,
//         .asm_simple,
//         .@"asm",
//         .asm_output,
//         .asm_input,
//         .error_value,
//         .error_union,
//         => {},
//     }
//     // fn ifFull(tree: Ast, node: Node.Index) full.If
//     // fn asmFull(tree: Ast, node: Node.Index) full.Asm
//     // fn whileFull(tree: Ast, node: Node.Index) full.While
//     // fn forFull(tree: Ast, node: Node.Index) full.For
//     // fn callFull(tree: Ast, node: Node.Index) full.Call
//     // fn fullVarDecl(tree: Ast, node: Node.Index) ?full.VarDecl
//     // fn fullIf(tree: Ast, node: Node.Index) ?full.If
//     // fn fullWhile(tree: Ast, node: Node.Index) ?full.While
//     // fn fullFor(tree: Ast, node: Node.Index) ?full.For
//     // fn fullContainerField(tree: Ast, node: Node.Index) ?full.ContainerField
//     // fn fullFnProto(tree: Ast, buffer: *[1]Ast.Node.Index, node: Node.Index) ?full.FnProto
//     // fn fullStructInit(tree: Ast, buffer: *[2]Ast.Node.Index, node: Node.Index) ?full.StructInit
//     // fn fullArrayInit(tree: Ast, buffer: *[2]Node.Index, node: Node.Index) ?full.ArrayInit
//     // fn fullArrayType(tree: Ast, node: Node.Index) ?full.ArrayType
//     // fn fullPtrType(tree: Ast, node: Node.Index) ?full.PtrType
//     // fn fullSlice(tree: Ast, node: Node.Index) ?full.Slice
//     // fn fullContainerDecl(tree: Ast, buffer: *[2]Ast.Node.Index, node: Node.Index) ?full.ContainerDecl
//     // fn fullSwitchCase(tree: Ast, node: Node.Index) ?full.SwitchCase
//     // fn fullAsm(tree: Ast, node: Node.Index) ?full.Asm
//     // fn fullCall(tree: Ast, buffer: *[1]Ast.Node.Index, node: Node.Index) ?full.Call
//     const buf: [3]Ast.Node.Index = undefined;
//     if (ast.ifFull(node)) |_| return "ifFull";
//     if (ast.asmFull(node)) |_| return "asmFull";
//     if (ast.whileFull(node)) |_| return "whileFull";
//     if (ast.forFull(node)) |_| return "forFull";
//     if (ast.callFull(node)) |_| return "callFull";
//     if (ast.fullVarDecl(node)) |_| return "fullVarDecl";
//     if (ast.fullIf(node)) |_| return "fullIf";
//     if (ast.fullWhile(node)) |_| return "fullWhile";
//     if (ast.fullFor(node)) |_| return "fullFor";
//     if (ast.fullContainerField(node)) |_| return "fullContainerField";
//     if (ast.fullFnProto(buf, buf[0..1], node)) |_| return "fullFnProto";
//     if (ast.fullStructInit(buf, buf[0..2], node)) |_| return "fullStructInit";
//     if (ast.fullArrayInit(buf, buf[0..2], node)) |_| return "fullArrayInit";
// var buf: [1]Ast.Node.Index = undefined;
//     if (ast.fullArrayType(node)) |_| return "fullArrayType";
//     if (ast.fullPtrType(node)) |_| return "fullPtrType";
//     if (ast.fullSlice(node)) |_| return "fullSlice";
//     if (ast.fullContainerDecl(buf, buf[0..2], node)) |_| return "fullContainerDecl";
//     if (ast.fullSwitchCase(node)) |_| return "fullSwitchCase";
//     if (ast.fullAsm(node)) |_| return "fullAsm";
//     if (ast.fullCall(buf, buf[0..1], node)) |_| return "fullCall";
//     return "unknown";
// }
//
//
pub export fn ifFull(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.ifFull(node)).ptr;
}
pub export fn asmFull(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.asmFull(node)).ptr;
}
pub export fn whileFull(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.whileFull(node)).ptr;
}
pub export fn forFull(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.forFull(node)).ptr;
}
pub export fn callFull(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.callFull(node)).ptr;
}
pub export fn fullVarDecl(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.fullVarDecl(node)).ptr;
}
pub export fn fullIf(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.fullIf(node)).ptr;
}
pub export fn fullWhile(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.fullWhile(node)).ptr;
}
pub export fn fullFor(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.fullFor(node)).ptr;
}
pub export fn fullContainerField(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.fullContainerField(node)).ptr;
}

pub export fn fullFnProto(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    var buf: [1]Ast.Node.Index = undefined;
    return stringify(ast.fullFnProto(buf[0..], node)).ptr;
}
pub export fn fullStructInit(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    var buf: [2]Ast.Node.Index = undefined;
    return stringify(ast.fullStructInit(buf[0..], node)).ptr;
}
pub export fn fullArrayInit(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    var buf: [2]Ast.Node.Index = undefined;
    return stringify(ast.fullArrayInit(buf[0..], node)).ptr;
}
pub export fn fullArrayType(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.fullArrayType(node)).ptr;
}
pub export fn fullPtrType(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.fullPtrType(node)).ptr;
}
pub export fn fullSlice(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.fullSlice(node)).ptr;
}
pub export fn fullContainerDecl(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    var buf: [2]Ast.Node.Index = undefined;
    return stringify(ast.fullContainerDecl(buf[0..2], node)).ptr;
}

pub export fn fullSwitchCase(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.fullSwitchCase(node)).ptr;
}
pub export fn fullAsm(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.fullAsm(node)).ptr;
}

pub export fn assignDestructure(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.assignDestructure(node)).ptr;
}
// pub fn globalVarDecl(tree: Ast, node: Node.Index) full.VarDecl {
// pub fn localVarDecl(tree: Ast, node: Node.Index) full.VarDecl {
// pub fn simpleVarDecl(tree: Ast, node: Node.Index) full.VarDecl {
// pub fn alignedVarDecl(tree: Ast, node: Node.Index) full.VarDecl {
// pub fn assignDestructure(tree: Ast, node: Node.Index) full.AssignDestructure {
pub export fn globalVarDecl(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.globalVarDecl(node)).ptr;
}
pub export fn localVarDecl(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.localVarDecl(node)).ptr;
}
pub export fn simpleVarDecl(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.simpleVarDecl(node)).ptr;
}
pub export fn alignedVarDecl(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return stringify(ast.alignedVarDecl(node)).ptr;
}

pub export fn fullCall(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    @setEvalBranchQuota(2000);
    var buf: [1]Ast.Node.Index = undefined;
    return stringify(ast.fullCall(buf[0..], node)).ptr;
}

pub export fn containerDeclRoot(ast: *Ast) [*:0]const u8 {
    return stringify(ast.containerDeclRoot()).ptr;
}

pub export fn getNodeSource(ast: *Ast, node: Ast.Node.Index) [*:0]const u8 {
    return wasmDupeZ(u8, ast.getNodeSource(node));
}

pub export fn tokenSlice(ast: *Ast, token: u32) [*:0]const u8 {
    return wasmDupeZ(u8, ast.tokenSlice(token));
}

pub export fn tokenLocation(ast: *Ast, byte_offset: u32, token: u32) [*:0]const u32 {
    const location = ast.tokenLocation(byte_offset, token);
    return wasmDupeZ(u32, &.{
        @intCast(location.line),
        @intCast(location.column),
        @intCast(location.line_start),
        @intCast(location.line_end),
    });
}

pub export fn getFirstToken(ast: *Ast, node: Ast.Node.Index) u32 {
    return ast.firstToken(node);
}

pub export fn getLastToken(ast: *Ast, node: Ast.Node.Index) u32 {
    return ast.lastToken(node);
}
const Range = struct {
    start_line: u32,
    start_column: u32,
    end_line: u32,
    end_column: u32,
};
fn charToRange(ast: *Ast, char_start: u32, char_end: u32) Range {
    var range = Range{
        .start_line = 0,
        .end_line = 0,
        .start_column = char_start,
        .end_column = char_end,
    };
    var start_of_current_line: u32 = 0;
    while (std.mem.indexOfScalarPos(u8, ast.source, start_of_current_line, '\n')) |_i| {
        const i: u32 = @intCast(_i);
        if (i >= char_start) {
            break; // Went past
        }
        start_of_current_line = i + 1;
        range.start_line += 1;
    }

    range.end_line = range.start_line;
    range.start_column -= start_of_current_line;

    while (std.mem.indexOfScalarPos(u8, ast.source, start_of_current_line, '\n')) |_i| {
        const i: u32 = @intCast(_i);
        if (i >= char_end) {
            break; // Went past
        }
        start_of_current_line = i + 1;
        range.end_line += 1;
    }
    range.end_column -= start_of_current_line;
    return range;
}
pub export fn getTokenRange(ast: *Ast, token: Ast.TokenIndex) [*:0]const u32 {
    const start = ast.tokens.items(.start)[@intCast(token)];
    const token_end = start + @as(u32, @intCast(ast.tokenSlice(token).len));
    const range = charToRange(ast, start, token_end);
    return wasmDupeZ(u32, &.{
        range.start_line,
        range.start_column,
        range.end_line,
        range.end_column,
    });
}

pub export fn getNodeRange(ast: *Ast, node: Ast.Node.Index) [*:0]const u32 {
    const start = ast.tokens.items(.start)[@intCast(ast.firstToken(node))];
    const last_token = ast.lastToken(node);
    const last_token_start = ast.tokens.items(.start)[@intCast(last_token)];
    const end = last_token_start + @as(u32, @intCast(ast.tokenSlice(last_token).len));
    const range = charToRange(ast, start, end);
    return wasmDupeZ(u32, &.{
        range.start_line,
        range.start_column,
        range.end_line,
        range.end_column,
    });
}
fn wasmDupeZ(comptime T: type, m: []const T) [*:0]T {
    return wasm.gpa.dupeZ(T, m) catch {
        @panic("failed to allocate memory");
    };
}
pub export fn nodeToSpan(ast: *Ast, node: Ast.Node.Index) [*:0]const u32 {
    return wasmDupeZ(u32, &.{
        ast.firstToken(node),
        ast.lastToken(node),
        ast.nodes.items(.main_token)[node],
    });
}

pub export fn tokenizeLine(line: [*:0]u8, len: usize) [*:0]const u32 {
    var tokens = std.ArrayList(u32).init(wasm.gpa);
    var tokenizer = std.zig.Tokenizer.init(line[0..len :0]);

    while (true) {
        const token = tokenizer.next();
        if (token.tag == .eof or token.tag == .invalid) {
            break;
        }
        tokens.appendSlice(&.{
            @intFromEnum(token.tag),
            @intCast(token.loc.start),
            @intCast(token.loc.end),
        }) catch {
            @panic("failed to append token");
        };
    }
    const list = tokens.toOwnedSliceSentinel(0) catch {
        @panic("failed to get tokens slice");
    };
    return list;
}
pub export fn render(ast: *Ast) [*:0]const u8 {
    var buffer = std.ArrayList(u8).init(wasm.gpa);
    ast.renderToArrayList(&buffer, .{}) catch |err| {
        switch (err) {
            inline else => |c_err| {
                @panic(std.fmt.comptimePrint("failed to render ast: {s}", .{@errorName(c_err)}));
            },
        }
    };
    return buffer.toOwnedSliceSentinel(0) catch {
        @panic("failed to get string slice");
    };
}

test {
    _ = @import("typescript.zig");
    _ = @import("assemble_zir.zig");
}

test "deallocs correctly" {
    const source = "fn main() { return 0; }";
    const source_buf = wasmDupeZ(u8, source);
    const ast = parseAstFromSource(source_buf, source.len);
    defer destroyAst(ast);

    const span = nodeToSpan(ast, 0);
    const len: usize = 3;
    defer wasmFreeU32Z(
        @intFromPtr(span),
        len,
    );

    const json = containerDeclRoot(ast);
    defer wasmFreeU8Z(
        @intFromPtr(json),
        std.mem.indexOfSentinel(u8, 0, json),
    );
}

const AstGen = std.zig.AstGen;
const Zir = std.zig.Zir;
const printZir = @import("print_zir.zig");
// zir
//
pub export fn debugZir(ast: *Ast) void {
    // var zir = wasmCreate(Zir);
    var zir = AstGen.generate(wasm.gpa, ast.*) catch {
        @panic("failed to generate zir");
    };
    defer zir.deinit(wasm.gpa);
    var wasm_writer = wasm.WasmWriter{};
    printZir.render(
        wasm.gpa,
        wasm_writer.writer(),
        ast,
        zir,
    ) catch {
        @panic("failed to render zir");
    };

    for (zir.instructions.items(.tag), zir.instructions.items(.data)) |tag, data| {
        wasm.println("tag: {s} {any}", .{ @tagName(tag), data });
    }
}

pub export fn generateZir(ast: *Ast) *Zir {
    // if (ast.errors.len > 0) {
    //     @panic("Cannot generate ZIR from AST with errors");
    // }
    const errors_len = ast.errors.len;
    ast.errors.len = 0;
    defer ast.errors.len = errors_len;
    const zir_ = AstGen.generate(wasm.gpa, ast.*) catch {
        @panic("failed to generate zir");
    };
    const zir = wasmCreate(Zir);
    zir.* = zir_;
    return zir;
}

pub export fn destroyZir(zir: *Zir) void {
    zir.deinit(wasm.gpa);
    wasmDestroy(zir);
}

pub export fn getZirInstructionsLength(zir: *Zir) u64 {
    return zir.instructions.len;
}
pub export fn getZirInstructionTag(zir: *Zir, instruction: u32) u32 {
    return @intFromEnum(zir.instructions.items(.tag)[instruction]);
}

pub export fn renderZir(zir: *Zir, ast: *Ast) [*:0]const u8 {
    // var buffer = std.BoundedArray(u8, 1024 * 1024).init(0) catch {
    var buffer = std.ArrayList(u8).initCapacity(wasm.gpa, 256) catch {
        @panic("failed to allocate memory");
    };

    printZir.render(
        wasm.gpa,
        buffer.writer(),
        ast,
        zir.*,
    ) catch {
        @panic("failed to render zir");
    };
    return buffer.toOwnedSliceSentinel(0) catch {
        @panic("failed to get string slice");
    };
}

pub const Diagnostic = struct {
    code: [:0]const u8,
    pos: u32,
    len: u32,
    token: u32,
    node: ?u32 = null,
    message: [*:0]const u8,
};

pub export fn getAstErrors(ast: *Ast) [*:0]const u8 {
    if (ast.errors.len == 0) {
        return stringify(null).ptr;
    }
    var arena = std.heap.ArenaAllocator.init(wasm.gpa);
    defer arena.deinit();
    const arena_allocator = arena.allocator();

    var diagnostics = std.ArrayListUnmanaged(Diagnostic).initCapacity(arena_allocator, ast.errors.len) catch {
        @panic("failed to allocate memory");
    };

    for (ast.errors) |err| {
        var buffer = std.ArrayListUnmanaged(u8){};
        ast.renderError(err, buffer.writer(arena_allocator)) catch {
            @panic("failed to render error");
        };
        diagnostics.appendAssumeCapacity(.{
            .code = @tagName(err.tag),
            .pos = ast.tokens.items(.start)[@intCast(err.token)],
            .len = @intCast(ast.tokenSlice(err.token).len),
            .token = err.token,
            .message = buffer.toOwnedSliceSentinel(arena_allocator, 0) catch {
                @panic("failed to get string slice");
            },
        });
    }
    return stringify(diagnostics.items);
}
pub export fn getZirErrors(zir: *Zir, ast: *Ast) [*:0]const u8 {
    const payload_index = zir.extra[@intFromEnum(Zir.ExtraIndex.compile_errors)];
    if (payload_index == 0) return stringify(null).ptr;

    const header = zir.extraData(Zir.Inst.CompileErrors, payload_index);
    const items_len = header.data.items_len;

    var arena = std.heap.ArenaAllocator.init(wasm.gpa);
    defer arena.deinit();
    const arena_allocator = arena.allocator();
    var diagnostics = std.ArrayListUnmanaged(Diagnostic).initCapacity(arena_allocator, items_len) catch {
        @panic("failed to allocate memory");
    };

    var extra_index = header.end;

    for (0..items_len) |_| {
        const item = zir.extraData(Zir.Inst.CompileErrors.Item, extra_index);
        extra_index = item.end;
        const node = item.data.node;
        const start_token = ast.firstToken(node);
        const end_token = ast.lastToken(node);
        const pos = ast.tokens.items(.start)[start_token];
        const end_token_len: u32 = @intCast(ast.tokenSlice(end_token).len);
        const end = ast.tokens.items(.start)[end_token] + end_token_len;
        diagnostics.appendAssumeCapacity(.{
            .code = "zir",
            .pos = pos,
            .len = end - pos,
            .token = item.data.token,
            .node = node,
            .message = zir.nullTerminatedString(item.data.msg).ptr,
        });
        // item.data.token;
        // item.data.node
        // const err_loc = blk: {
        //     if (item.data.node != 0) {
        //         break :blk offsets.nodeToLoc(tree, item.data.node);
        //     }
        //     const loc = offsets.tokenToLoc(tree, item.data.token);
        //     break :blk offsets.Loc{
        //         .start = loc.start + item.data.byte_offset,
        //         .end = loc.end,
        //     };
        // };

        // var notes: []types.DiagnosticRelatedInformation = &.{};
        // if (item.data.notes == 0) continue;
        // const block = zir.extraData(Zir.Inst.Block, item.data.notes);
        // const body = zir.extra[block.end..][0..block.data.body_len];
        //
        //  notes = try arena.alloc(types.DiagnosticRelatedInformation, body.len);
        // for (notes, body) |*note, note_index| {
        //     const note_item = zir.extraData(Zir.Inst.CompileErrors.Item, note_index);
        //     const msg = zir.nullTerminatedString(note_item.data.msg);
        //
        //     const loc = blk: {
        //         if (note_item.data.node != 0) {
        //             break :blk offsets.nodeToLoc(tree, note_item.data.node);
        //         }
        //         const loc = offsets.tokenToLoc(tree, note_item.data.token);
        //         break :blk offsets.Loc{
        //             .start = loc.start + note_item.data.byte_offset,
        //             .end = loc.end,
        //         };
        //     };
        //
        //     note.* = .{
        //         .location = .{
        //             .uri = handle.uri,
        //             .range = offsets.locToRange(handle.tree.source, loc, server.offset_encoding),
        //         },
        //         .message = msg,
        //     };

        // const msg = zir.nullTerminatedString(item.data.msg);
        // diagnostics.appendAssumeCapacity(.{
        //     .range = offsets.locToRange(handle.tree.source, err_loc, server.offset_encoding),
        //     .severity = .Error,
        //     .code = .{ .string = "ast_check" },
        //     .source = "zls",
        //     .message = msg,
        //     .relatedInformation = if (notes.len != 0) notes else null,
        // });
    }
    return stringify(diagnostics.items);
}
// pub export fn getZirInstructionData(zir: *Zir, instruction: u32) [*:0]const u32 {
//     const data = zir.instructions.items(.data)[instruction];
//     return wasmDupeZ(u32, data);
// }
test "zir" {
    const source =
        \\fn main() void {
        \\    const x: i32 = 2;
        \\    const y: i32 = 2;
        \\    cons
        \\}
    ;
    const source_buf = wasmDupeZ(u8, source);
    const ast = parseAstFromSource(source_buf, source.len);
    defer destroyAst(ast);

    const zir = generateZir(ast);
    defer destroyZir(zir);

    const rendered = renderZir(zir, ast);
    std.debug.print(" {s}\n", .{rendered});
    defer wasmFreeU8Z(
        @intFromPtr(rendered),
        std.mem.indexOfSentinel(u8, 0, rendered),
    );
}
