const std = @import("std");
const mem = std.mem;
const Allocator = std.mem.Allocator;
const assert = std.debug.assert;
const Ast = std.zig.Ast;
// const InternPool = @import("InternPool.zig");

const Zir = std.zig.Zir;
// const Zcu = std.builtin.Type.Zcu;
// const LazySrcLoc = Zcu.LazySrcLoc;
const ZcuIndex = enum(u32) {
    u0_type,
    i0_type,
    u1_type,
    u8_type,
    i8_type,
    u16_type,
    i16_type,
    u29_type,
    u32_type,
    i32_type,
    u64_type,
    i64_type,
    u80_type,
    u128_type,
    i128_type,
    usize_type,
    isize_type,
    c_char_type,
    c_short_type,
    c_ushort_type,
    c_int_type,
    c_uint_type,
    c_long_type,
    c_ulong_type,
    c_longlong_type,
    c_ulonglong_type,
    c_longdouble_type,
    f16_type,
    f32_type,
    f64_type,
    f80_type,
    f128_type,
    anyopaque_type,
    bool_type,
    void_type,
    type_type,
    anyerror_type,
    comptime_int_type,
    comptime_float_type,
    noreturn_type,
    anyframe_type,
    null_type,
    undefined_type,
    enum_literal_type,
    atomic_order_type,
    atomic_rmw_op_type,
    calling_convention_type,
    address_space_type,
    float_mode_type,
    reduce_op_type,
    call_modifier_type,
    prefetch_options_type,
    export_options_type,
    extern_options_type,
    type_info_type,
    manyptr_u8_type,
    manyptr_const_u8_type,
    manyptr_const_u8_sentinel_0_type,
    single_const_pointer_to_comptime_int_type,
    slice_const_u8_type,
    slice_const_u8_sentinel_0_type,
    optional_noreturn_type,
    anyerror_void_error_union_type,
    /// Used for the inferred error set of inline/comptime function calls.
    adhoc_inferred_error_set_type,
    generic_poison_type,
    /// `@TypeOf(.{})`
    empty_struct_type,

    /// `undefined` (untyped)
    undef,
    /// `0` (comptime_int)
    zero,
    /// `0` (usize)
    zero_usize,
    /// `0` (u8)
    zero_u8,
    /// `1` (comptime_int)
    one,
    /// `1` (usize)
    one_usize,
    /// `1` (u8)
    one_u8,
    /// `4` (u8)
    four_u8,
    /// `-1` (comptime_int)
    negative_one,
    /// `std.builtin.CallingConvention.C`
    calling_convention_c,
    /// `std.builtin.CallingConvention.Inline`
    calling_convention_inline,
    /// `{}`
    void_value,
    /// `unreachable` (noreturn type)
    unreachable_value,
    /// `null` (untyped)
    null_value,
    /// `true`
    bool_true,
    /// `false`
    bool_false,
    /// `.{}` (untyped)
    empty_struct,

    /// Used for generic parameters where the type and value
    /// is not known until generic function instantiation.
    generic_poison,

    /// Used by Air/Sema only.
    none = std.math.maxInt(u32),

    _,
};

const ZirAssembler = @This();

const Import = struct {
    token: Ast.TokenIndex,
    name: [:0]const u8,
};
allocator: Allocator,
import_list: std.ArrayList(Import),
tree: *Ast,
code: Zir,

pub fn init(allocator: Allocator, ast: *Ast, zir: Zir) ZirAssembler {
    return .{
        .import_list = std.ArrayList(Import).init(allocator),
        .allocator = allocator,
        .tree = ast,
        .code = zir,
    };
    // try self.import_list.init(allocator, 0);
}
fn getTag(self: *ZirAssembler, inst: Zir.Inst.Index) Zir.Inst.Tag {
    const tags = self.code.instructions.items(.tag);
    return tags[@intFromEnum(inst)];
}

pub fn pushInst(self: *ZirAssembler, inst: Zir.Inst.Index) !void {
    const tag = self.getTag(inst);
    std.debug.print("tag: {s}\n", .{@tagName(tag)});

    switch (tag) {
        .alloc,
        .alloc_mut,
        .alloc_comptime_mut,
        .elem_type,
        .indexable_ptr_elem_type,
        .vector_elem_type,
        .indexable_ptr_len,
        .anyframe_type,
        .bit_not,
        .bool_not,
        .negate,
        .negate_wrap,
        .load,
        .ensure_result_used,
        .ensure_result_non_error,
        .ensure_err_union_payload_void,
        .ret_node,
        .ret_load,
        .resolve_inferred_alloc,
        .optional_type,
        .optional_payload_safe,
        .optional_payload_unsafe,
        .optional_payload_safe_ptr,
        .optional_payload_unsafe_ptr,
        .err_union_payload_unsafe,
        .err_union_payload_unsafe_ptr,
        .err_union_code,
        .err_union_code_ptr,
        .is_non_null,
        .is_non_null_ptr,
        .is_non_err,
        .is_non_err_ptr,
        .ret_is_non_err,
        .typeof,
        .type_info,
        .size_of,
        .bit_size_of,
        .typeof_log2_int_type,
        .int_from_ptr,
        .compile_error,
        .set_eval_branch_quota,
        .int_from_enum,
        .align_of,
        .int_from_bool,
        .embed_file,
        .error_name,
        .panic,
        .set_runtime_safety,
        .sqrt,
        .sin,
        .cos,
        .tan,
        .exp,
        .exp2,
        .log,
        .log2,
        .log10,
        .abs,
        .floor,
        .ceil,
        .trunc,
        .round,
        .tag_name,
        .type_name,
        .frame_type,
        .frame_size,
        .clz,
        .ctz,
        .pop_count,
        .byte_swap,
        .bit_reverse,
        .@"resume",
        .@"await",
        .make_ptr_const,
        .validate_deref,
        .check_comptime_control_flow,
        .opt_eu_base_ptr_init,
        .restore_err_ret_index_unconditional,
        .restore_err_ret_index_fn_entry,
        => return error.Todo,
        // => try self.writeUnNode(stream, inst),

        .ref,
        .ret_implicit,
        .validate_ref_ty,
        => return error.Todo,
        // => try self.writeUnTok(stream, inst),

        .bool_br_and,
        .bool_br_or,
        => return error.Todo,
        // => try self.writeBoolBr(stream, inst),

        .validate_destructure => return error.Todo, //try self.writeValidateDestructure(stream, inst),
        .array_type_sentinel => return error.Todo, //try self.writeArrayTypeSentinel(stream, inst),
        .ptr_type => return error.Todo, //try self.writePtrType(stream, inst),
        .int => return error.Todo, //try self.writeInt(stream, inst),
        .int_big => return error.Todo, // try self.writeIntBig(stream, inst),
        .float => return error.Todo, //try self.writeFloat(stream, inst),
        .float128 => return error.Todo, //try self.writeFloat128(stream, inst),
        .str => return error.Todo, // try self.writeStr(stream, inst),
        .int_type => return error.Todo, //try self.writeIntType(stream, inst),

        .save_err_ret_index => return error.Todo, //try self.writeSaveErrRetIndex(stream, inst),

        .@"break",
        .break_inline,
        => return error.Todo, //try self.writeBreak(stream, inst),

        .slice_start => return error.Todo, // try self.writeSliceStart(stream, inst),
        .slice_end => return error.Todo, // try self.writeSliceEnd(stream, inst),
        .slice_sentinel => return error.Todo, // try self.writeSliceSentinel(stream, inst),
        .slice_length => return error.Todo, // try self.writeSliceLength(stream, inst),

        .union_init => return error.Todo, // try self.writeUnionInit(stream, inst),

        // Struct inits

        .struct_init_empty,
        .struct_init_empty_result,
        .struct_init_empty_ref_result,
        => return error.Todo, //try self.writeUnNode(stream, inst),

        .struct_init_anon => return error.Todo, // try self.writeStructInitAnon(stream, inst),

        .struct_init,
        .struct_init_ref,
        => return error.Todo, // try self.writeStructInit(stream, inst),

        .validate_struct_init_ty,
        .validate_struct_init_result_ty,
        => return error.Todo, //try self.writeUnNode(stream, inst),

        .validate_ptr_struct_init => return error.Todo, //try self.writeBlock(stream, inst),
        .struct_init_field_type => return error.Todo, //try self.writeStructInitFieldType(stream, inst),
        .struct_init_field_ptr => return error.Todo, //try self.writePlNodeField(stream, inst),

        // Array inits

        .array_init_anon => return error.Todo, //try self.writeArrayInitAnon(stream, inst),

        .array_init,
        .array_init_ref,
        => return error.Todo, //try self.writeArrayInit(stream, inst),

        .validate_array_init_ty,
        .validate_array_init_result_ty,
        => return error.Todo, //try self.writeValidateArrayInitTy(stream, inst),

        .validate_array_init_ref_ty => return error.Todo, //try self.writeValidateArrayInitRefTy(stream, inst),
        .validate_ptr_array_init => return error.Todo, //try self.writeBlock(stream, inst),
        .array_init_elem_type => return error.Todo, //try self.writeArrayInitElemType(stream, inst),
        .array_init_elem_ptr => return error.Todo, // try self.writeArrayInitElemPtr(stream, inst),

        .atomic_load => return error.Todo, // try self.writeAtomicLoad(stream, inst),
        .atomic_store => return error.Todo, // try self.writeAtomicStore(stream, inst),
        .atomic_rmw => return error.Todo, // try self.writeAtomicRmw(stream, inst),
        .shuffle => return error.Todo, // try self.writeShuffle(stream, inst),
        .mul_add => return error.Todo, // try self.writeMulAdd(stream, inst),
        .builtin_call => return error.Todo, // try self.writeBuiltinCall(stream, inst),

        .field_type_ref => return error.Todo, // try self.writeFieldTypeRef(stream, inst),

        .add,
        .addwrap,
        .add_sat,
        .add_unsafe,
        .array_cat,
        .mul,
        .mulwrap,
        .mul_sat,
        .sub,
        .subwrap,
        .sub_sat,
        .cmp_lt,
        .cmp_lte,
        .cmp_eq,
        .cmp_gte,
        .cmp_gt,
        .cmp_neq,
        .div,
        .has_decl,
        .has_field,
        .mod_rem,
        .shl,
        .shl_exact,
        .shl_sat,
        .shr,
        .shr_exact,
        .xor,
        .store_node,
        .store_to_inferred_ptr,
        .error_union_type,
        .merge_error_sets,
        .bit_and,
        .bit_or,
        .int_from_float,
        .float_from_int,
        .ptr_from_int,
        .enum_from_int,
        .float_cast,
        .int_cast,
        .ptr_cast,
        .truncate,
        .div_exact,
        .div_floor,
        .div_trunc,
        .mod,
        .rem,
        .bit_offset_of,
        .offset_of,
        .splat,
        .reduce,
        .bitcast,
        .vector_type,
        .max,
        .min,
        .memcpy,
        .memset,
        .elem_ptr_node,
        .elem_val_node,
        .elem_ptr,
        .elem_val,
        .array_type,
        .coerce_ptr_elem_ty,
        => return error.Todo, // try self.writePlNodeBin(stream, inst),

        .for_len => return error.Todo, // try self.writePlNodeMultiOp(stream, inst),

        .array_mul => return error.Todo, // try self.writeArrayMul(stream, inst),

        .elem_val_imm => return error.Todo, // try self.writeElemValImm(stream, inst),

        .@"export" => return error.Todo, // try self.writePlNodeExport(stream, inst),
        .export_value => return error.Todo, // try self.writePlNodeExportValue(stream, inst),

        .call => return error.Todo, // try self.writeCall(stream, inst, .direct),
        .field_call => return error.Todo, // try self.writeCall(stream, inst, .field),

        .block,
        .block_comptime,
        .block_inline,
        .suspend_block,
        .loop,
        .c_import,
        .typeof_builtin,
        => return error.Todo, // try self.writeBlock(stream, inst),

        .condbr,
        .condbr_inline,
        => return error.Todo, // try self.writeCondBr(stream, inst),

        .@"try",
        .try_ptr,
        => return error.Todo, // try self.writeTry(stream, inst),

        .error_set_decl => return error.Todo, // try self.writeErrorSetDecl(stream, inst),

        .switch_block,
        .switch_block_ref,
        => return error.Todo, // try self.writeSwitchBlock(stream, inst),

        .switch_block_err_union => return error.Todo, // try self.writeSwitchBlockErrUnion(stream, inst),

        .field_val,
        .field_ptr,
        => return error.Todo, // try self.writePlNodeField(stream, inst),

        .field_ptr_named,
        .field_val_named,
        => return error.Todo, // try self.writePlNodeFieldNamed(stream, inst),

        .as_node, .as_shift_operand => return error.Todo, // try self.writeAs(stream, inst),

        .repeat,
        .repeat_inline,
        .alloc_inferred,
        .alloc_inferred_mut,
        .alloc_inferred_comptime,
        .alloc_inferred_comptime_mut,
        .ret_ptr,
        .ret_type,
        .trap,
        => return error.Todo, // try self.writeNode(stream, inst),

        .error_value,
        .enum_literal,
        .decl_ref,
        .decl_val,
        .import,
        .ret_err_value,
        .ret_err_value_code,
        .param_anytype,
        .param_anytype_comptime,
        => return error.Todo, // try self.writeStrTok(stream, inst),

        .dbg_var_ptr,
        .dbg_var_val,
        => return error.Todo, // try self.writeStrOp(stream, inst),

        .param, .param_comptime => return error.Todo, // try self.writeParam(stream, inst),

        .func => return error.Todo, //try self.writeFunc(stream, inst, false),
        .func_inferred => return error.Todo, // try self.writeFunc(stream, inst, true),
        .func_fancy => return error.Todo, // try self.writeFuncFancy(stream, inst),

        .@"unreachable" => return error.Todo, // try self.writeUnreachable(stream, inst),

        .dbg_stmt => return error.Todo, // try self.writeDbgStmt(stream, inst),

        .@"defer" => return error.Todo, // try self.writeDefer(stream, inst),
        .defer_err_code => return error.Todo, // try self.writeDeferErrCode(stream, inst),

        .declaration => return error.Todo, // try self.writeDeclaration(stream, inst),

        .extended => return self.pushExtended(inst),
    }
}
pub fn pushExtended(self: *ZirAssembler, inst: Zir.Inst.Index) !void {
    const extended = self.code.instructions.items(.data)[@intFromEnum(inst)].extended;
    // try stream.print("{s}(", .{@tagName(extended.opcode)});
    switch (extended.opcode) {
        // .this,
        // .ret_addr,
        // .error_return_trace,
        // .frame,
        // .frame_address,
        // .breakpoint,
        // .disable_instrumentation,
        // .c_va_start,
        // .in_comptime,
        // .value_placeholder,
        // => try self.writeExtNode(stream, extended),
        //
        // .builtin_src => {
        //     try stream.writeAll("))");
        //     const inst_data = self.code.extraData(Zir.Inst.LineColumn, extended.operand).data;
        //     try stream.print(":{d}:{d}", .{ inst_data.line + 1, inst_data.column + 1 });
        // },
        //
        // .@"asm" => try self.writeAsm(stream, extended, false),
        // .asm_expr => try self.writeAsm(stream, extended, true),
        // .variable => try self.writeVarExtended(stream, extended),
        // .alloc => try self.writeAllocExtended(stream, extended),
        //
        // .compile_log => try self.writeNodeMultiOp(stream, extended),
        // .typeof_peer => try self.writeTypeofPeer(stream, extended),
        // .min_multi => try self.writeNodeMultiOp(stream, extended),
        // .max_multi => try self.writeNodeMultiOp(stream, extended),
        //
        // .select => try self.writeSelect(stream, extended),
        //
        // .add_with_overflow,
        // .sub_with_overflow,
        // .mul_with_overflow,
        // .shl_with_overflow,
        // => try self.writeOverflowArithmetic(stream, extended),
        //
        .struct_decl => {},
        // .union_decl => try self.writeUnionDecl(stream, extended),
        // .enum_decl => try self.writeEnumDecl(stream, extended),
        // .opaque_decl => try self.writeOpaqueDecl(stream, extended),
        //
        // .await_nosuspend,
        // .c_undef,
        // .c_include,
        // .fence,
        // .set_float_mode,
        // .set_align_stack,
        // .set_cold,
        // .wasm_memory_size,
        // .int_from_error,
        // .error_from_int,
        // .c_va_copy,
        // .c_va_end,
        // .work_item_id,
        // .work_group_size,
        // .work_group_id,
        // => {
        //     const inst_data = self.code.extraData(Zir.Inst.UnNode, extended.operand).data;
        //     try self.writeInstRef(stream, inst_data.operand);
        //     try stream.writeAll(")) ");
        //     try self.writeSrcNode(stream, inst_data.node);
        // },
        //
        // .reify => {
        //     const inst_data = self.code.extraData(Zir.Inst.Reify, extended.operand).data;
        //     try stream.print("line({d}), ", .{inst_data.src_line});
        //     try self.writeInstRef(stream, inst_data.operand);
        //     try stream.writeAll(")) ");
        //     const prev_parent_decl_node = self.parent_decl_node;
        //     self.parent_decl_node = inst_data.node;
        //     defer self.parent_decl_node = prev_parent_decl_node;
        //     try self.writeSrcNode(stream, 0);
        // },
        //
        // .builtin_extern,
        // .c_define,
        // .error_cast,
        // .wasm_memory_grow,
        // .prefetch,
        // .c_va_arg,
        // => {
        //     const inst_data = self.code.extraData(Zir.Inst.BinNode, extended.operand).data;
        //     try self.writeInstRef(stream, inst_data.lhs);
        //     try stream.writeAll(", ");
        //     try self.writeInstRef(stream, inst_data.rhs);
        //     try stream.writeAll(")) ");
        //     try self.writeSrcNode(stream, inst_data.node);
        // },
        //
        // .builtin_async_call => try self.writeBuiltinAsyncCall(stream, extended),
        // .cmpxchg => try self.writeCmpxchg(stream, extended),
        // .ptr_cast_full => try self.writePtrCastFull(stream, extended),
        // .ptr_cast_no_dest => try self.writePtrCastNoDest(stream, extended),
        //
        // .restore_err_ret_index => try self.writeRestoreErrRetIndex(stream, extended),
        // .closure_get => try self.writeClosureGet(stream, extended),
        // .field_parent_ptr => try self.writeFieldParentPtr(stream, extended),

        else => return error.Todo,
    }
}

fn pushStructDecl(self: *ZirAssembler, inst: Zir.Inst.Index) !void {
    const extended = self.code.instructions.items(.data)[@intFromEnum(inst)].extended;
    const small: Zir.Inst.StructDecl.Small = @bitCast(extended.small);

    const extra = self.code.extraData(Zir.Inst.StructDecl, extended.operand);

    const prev_parent_decl_node = self.parent_decl_node;
    self.parent_decl_node = extra.data.src_node;
    defer self.parent_decl_node = prev_parent_decl_node;

    const fields_hash: std.zig.SrcHash = @bitCast([4]u32{
        extra.data.fields_hash_0,
        extra.data.fields_hash_1,
        extra.data.fields_hash_2,
        extra.data.fields_hash_3,
    });
    const hash = std.fmt.fmtSliceHexLower(&fields_hash);
    _ = hash; // autofix
    // try stream.print("hash({}) ", .{std.fmt.fmtSliceHexLower(&fields_hash)});
    //
    var extra_index: usize = extra.end;

    const captures_len = if (small.has_captures_len) blk: {
        const captures_len = self.code.extra[extra_index];
        extra_index += 1;
        break :blk captures_len;
    } else 0;

    const fields_len = if (small.has_fields_len) blk: {
        const fields_len = self.code.extra[extra_index];
        extra_index += 1;
        break :blk fields_len;
    } else 0;
    _ = fields_len; // autofix

    const decls_len = if (small.has_decls_len) blk: {
        const decls_len = self.code.extra[extra_index];
        extra_index += 1;
        break :blk decls_len;
    } else 0;
    _ = decls_len; // autofix
    //
    // try self.writeFlag(stream, "known_non_opv, ", small.known_non_opv);
    // try self.writeFlag(stream, "known_comptime_only, ", small.known_comptime_only);
    // try self.writeFlag(stream, "tuple, ", small.is_tuple);
    //
    // try stream.print("{s}, ", .{@tagName(small.name_strategy)});
    //
    for (0..captures_len) |_| {
        const capture: Zir.Inst.Capture = @bitCast(self.code.extra[extra_index]);
        const capture_unwrapped: Zir.Inst.Capture.Unwrapped = capture.unwrap();
        std.debug.print("capture: {any}\n", .{capture_unwrapped});
        extra_index += 1;
    }
    //
    // try stream.writeAll(@tagName(small.layout));
    // if (small.has_backing_int) {
    //     const backing_int_body_len = self.code.extra[extra_index];
    //     extra_index += 1;
    //     try stream.writeAll("(");
    //     if (backing_int_body_len == 0) {
    //         const backing_int_ref: Zir.Inst.Ref = @enumFromInt(self.code.extra[extra_index]);
    //         extra_index += 1;
    //         try self.writeInstRef(stream, backing_int_ref);
    //     } else {
    //         const body = self.code.bodySlice(extra_index, backing_int_body_len);
    //         extra_index += backing_int_body_len;
    //         self.indent += 2;
    //         try self.writeBracedDecl(stream, body);
    //         self.indent -= 2;
    //     }
    //     try stream.writeAll(")");
    // } else {}
    // try stream.print(", ", .{});
    //
    // if (decls_len == 0) {
    //     try stream.writeAll("{}, ");
    // } else {
    //     try stream.writeAll("{\n");
    //     self.indent += 2;
    //     try self.writeBody(stream, self.code.bodySlice(extra_index, decls_len));
    //     self.indent -= 2;
    //     extra_index += decls_len;
    //     try stream.writeByteNTimes(' ', self.indent);
    //     try stream.writeAll("}, ");
    // }
    //
    // if (fields_len == 0) {
    //     try stream.writeAll("{}, {}) ");
    // } else {
    //     const bits_per_field = 4;
    //     const fields_per_u32 = 32 / bits_per_field;
    //     const bit_bags_count = std.math.divCeil(usize, fields_len, fields_per_u32) catch unreachable;
    //     const Field = struct {
    //         doc_comment_index: Zir.NullTerminatedString,
    //         type_len: u32 = 0,
    //         align_len: u32 = 0,
    //         init_len: u32 = 0,
    //         type: Zir.Inst.Ref = .none,
    //         name: Zir.NullTerminatedString,
    //         is_comptime: bool,
    //     };
    //     const fields = try self.arena.alloc(Field, fields_len);
    //     {
    //         var bit_bag_index: usize = extra_index;
    //         extra_index += bit_bags_count;
    //         var cur_bit_bag: u32 = undefined;
    //         var field_i: u32 = 0;
    //         while (field_i < fields_len) : (field_i += 1) {
    //             if (field_i % fields_per_u32 == 0) {
    //                 cur_bit_bag = self.code.extra[bit_bag_index];
    //                 bit_bag_index += 1;
    //             }
    //             const has_align = @as(u1, @truncate(cur_bit_bag)) != 0;
    //             cur_bit_bag >>= 1;
    //             const has_default = @as(u1, @truncate(cur_bit_bag)) != 0;
    //             cur_bit_bag >>= 1;
    //             const is_comptime = @as(u1, @truncate(cur_bit_bag)) != 0;
    //             cur_bit_bag >>= 1;
    //             const has_type_body = @as(u1, @truncate(cur_bit_bag)) != 0;
    //             cur_bit_bag >>= 1;
    //
    //             var field_name_index: Zir.NullTerminatedString = .empty;
    //             if (!small.is_tuple) {
    //                 field_name_index = @enumFromInt(self.code.extra[extra_index]);
    //                 extra_index += 1;
    //             }
    //             const doc_comment_index: Zir.NullTerminatedString = @enumFromInt(self.code.extra[extra_index]);
    //             extra_index += 1;
    //
    //             fields[field_i] = .{
    //                 .doc_comment_index = doc_comment_index,
    //                 .is_comptime = is_comptime,
    //                 .name = field_name_index,
    //             };
    //
    //             if (has_type_body) {
    //                 fields[field_i].type_len = self.code.extra[extra_index];
    //             } else {
    //                 fields[field_i].type = @enumFromInt(self.code.extra[extra_index]);
    //             }
    //             extra_index += 1;
    //
    //             if (has_align) {
    //                 fields[field_i].align_len = self.code.extra[extra_index];
    //                 extra_index += 1;
    //             }
    //
    //             if (has_default) {
    //                 fields[field_i].init_len = self.code.extra[extra_index];
    //                 extra_index += 1;
    //             }
    //         }
    //     }
    //
    //     try stream.writeAll("{\n");
    //     self.indent += 2;
    //
    //     for (fields, 0..) |field, i| {
    //         try self.writeDocComment(stream, field.doc_comment_index);
    //         try stream.writeByteNTimes(' ', self.indent);
    //         try self.writeFlag(stream, "comptime ", field.is_comptime);
    //         if (field.name != .empty) {
    //             const field_name = self.code.nullTerminatedString(field.name);
    //             try stream.print("{p}: ", .{std.zig.fmtId(field_name)});
    //         } else {
    //             try stream.print("@\"{d}\": ", .{i});
    //         }
    //         if (field.type != .none) {
    //             try self.writeInstRef(stream, field.type);
    //         }
    //
    //         if (field.type_len > 0) {
    //             const body = self.code.bodySlice(extra_index, field.type_len);
    //             extra_index += body.len;
    //             self.indent += 2;
    //             try self.writeBracedDecl(stream, body);
    //             self.indent -= 2;
    //         }
    //
    //         if (field.align_len > 0) {
    //             const body = self.code.bodySlice(extra_index, field.align_len);
    //             extra_index += body.len;
    //             self.indent += 2;
    //             try stream.writeAll(" align(");
    //             try self.writeBracedDecl(stream, body);
    //             try stream.writeAll(")");
    //             self.indent -= 2;
    //         }
    //
    //         if (field.init_len > 0) {
    //             const body = self.code.bodySlice(extra_index, field.init_len);
    //             extra_index += body.len;
    //             self.indent += 2;
    //             try stream.writeAll(" = ");
    //             try self.writeBracedDecl(stream, body);
    //             self.indent -= 2;
    //         }
    //
    //         try stream.writeAll(",\n");
    //     }
    //
    //     self.indent -= 2;
    //     try stream.writeByteNTimes(' ', self.indent);
    //     try stream.writeAll("}) ");
    // }
    // try self.writeSrcNode(stream, 0);
}

pub fn deinit(self: *ZirAssembler) void {
    self.import_list.deinit();
}
pub fn render(
    self: *ZirAssembler,
    allocator: Allocator,
) !void {
    _ = allocator; // autofix
    const zir = self.code;
    const tree = self.tree;
    const imports_index = zir.extra[@intFromEnum(Zir.ExtraIndex.imports)];
    const main_struct_inst: Zir.Inst.Index = .main_struct_inst;
    try self.pushInst(main_struct_inst);
    if (imports_index == 0) {
        return;
    }
    const extra = zir.extraData(Zir.Inst.Imports, imports_index);
    var extra_index = extra.end;
    for (0..extra.data.imports_len) |_| {
        const item = zir.extraData(Zir.Inst.Imports.Item, extra_index);
        extra_index = item.end;

        const import_path = zir.nullTerminatedString(item.data.name);
        try self.import_list.append(.{
            .token = item.data.token,
            .name = import_path,
        });
        std.debug.print("import_path: {s}\n", .{import_path});
        std.debug.print("{s}\n", .{tree.tokenSlice(item.data.token)});
        // try stream.print("  @import(\"{}\") ", .{
        // std.zig.fmtEscapes(import_path),
        // });
        // try writer.writeSrcTokAbs(stream, item.data.token);
        // try stream.writeAll("\n");
    }
}
const test_allocator = std.testing.allocator;
test "assemble-zir" {
    // const source = "fn main() void { @import(\"std\").debug.print(\"hello, world\\n\", .{}); }";
    const source = try std.fs.cwd().readFileAllocOptions(
        test_allocator,
        "src/demo.zig",
        1024 * 1024,
        null,
        @alignOf(u8),
        0,
    );
    defer test_allocator.free(source);
    var ast = try Ast.parse(test_allocator, source, .zig);
    defer ast.deinit(test_allocator);
    var zir = try std.zig.AstGen.generate(
        test_allocator,
        ast,
    );
    defer zir.deinit(test_allocator);
    var assembler = ZirAssembler.init(
        test_allocator,
        &ast,
        zir,
    );
    defer assembler.deinit();
    try assembler.render(
        test_allocator,
    );

    const stderr = std.io.getStdErr();
    const T = union(enum) {
        a: struct {},
        b: struct {
            pub const b = "bb";
        },
    };
    try std.json.stringify(
        // assembler.import_list.items,
        T{ .a = .{} },
        .{ .whitespace = .indent_2 },
        stderr.writer(),
    );
}
