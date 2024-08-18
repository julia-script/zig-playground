export type AstTokenIndex = number;
export type AstNodeIndex = number;

export enum TokenTag {
  Invalid = 0,
  InvalidPeriodasterisks = 1,
  Identifier = 2,
  StringLiteral = 3,
  MultilineStringLiteralLine = 4,
  CharLiteral = 5,
  Eof = 6,
  Builtin = 7,
  Bang = 8,
  Pipe = 9,
  PipePipe = 10,
  PipeEqual = 11,
  Equal = 12,
  EqualEqual = 13,
  EqualAngleBracketRight = 14,
  BangEqual = 15,
  LParen = 16,
  RParen = 17,
  Semicolon = 18,
  Percent = 19,
  PercentEqual = 20,
  LBrace = 21,
  RBrace = 22,
  LBracket = 23,
  RBracket = 24,
  Period = 25,
  PeriodAsterisk = 26,
  Ellipsis2 = 27,
  Ellipsis3 = 28,
  Caret = 29,
  CaretEqual = 30,
  Plus = 31,
  PlusPlus = 32,
  PlusEqual = 33,
  PlusPercent = 34,
  PlusPercentEqual = 35,
  PlusPipe = 36,
  PlusPipeEqual = 37,
  Minus = 38,
  MinusEqual = 39,
  MinusPercent = 40,
  MinusPercentEqual = 41,
  MinusPipe = 42,
  MinusPipeEqual = 43,
  Asterisk = 44,
  AsteriskEqual = 45,
  AsteriskAsterisk = 46,
  AsteriskPercent = 47,
  AsteriskPercentEqual = 48,
  AsteriskPipe = 49,
  AsteriskPipeEqual = 50,
  Arrow = 51,
  Colon = 52,
  Slash = 53,
  SlashEqual = 54,
  Comma = 55,
  Ampersand = 56,
  AmpersandEqual = 57,
  QuestionMark = 58,
  AngleBracketLeft = 59,
  AngleBracketLeftEqual = 60,
  AngleBracketAngleBracketLeft = 61,
  AngleBracketAngleBracketLeftEqual = 62,
  AngleBracketAngleBracketLeftPipe = 63,
  AngleBracketAngleBracketLeftPipeEqual = 64,
  AngleBracketRight = 65,
  AngleBracketRightEqual = 66,
  AngleBracketAngleBracketRight = 67,
  AngleBracketAngleBracketRightEqual = 68,
  Tilde = 69,
  NumberLiteral = 70,
  DocComment = 71,
  ContainerDocComment = 72,
  KeywordAddrspace = 73,
  KeywordAlign = 74,
  KeywordAllowzero = 75,
  KeywordAnd = 76,
  KeywordAnyframe = 77,
  KeywordAnytype = 78,
  KeywordAsm = 79,
  KeywordAsync = 80,
  KeywordAwait = 81,
  KeywordBreak = 82,
  KeywordCallconv = 83,
  KeywordCatch = 84,
  KeywordComptime = 85,
  KeywordConst = 86,
  KeywordContinue = 87,
  KeywordDefer = 88,
  KeywordElse = 89,
  KeywordEnum = 90,
  KeywordErrdefer = 91,
  KeywordError = 92,
  KeywordExport = 93,
  KeywordExtern = 94,
  KeywordFn = 95,
  KeywordFor = 96,
  KeywordIf = 97,
  KeywordInline = 98,
  KeywordNoalias = 99,
  KeywordNoinline = 100,
  KeywordNosuspend = 101,
  KeywordOpaque = 102,
  KeywordOr = 103,
  KeywordOrelse = 104,
  KeywordPacked = 105,
  KeywordPub = 106,
  KeywordResume = 107,
  KeywordReturn = 108,
  KeywordLinksection = 109,
  KeywordStruct = 110,
  KeywordSuspend = 111,
  KeywordSwitch = 112,
  KeywordTest = 113,
  KeywordThreadlocal = 114,
  KeywordTry = 115,
  KeywordUnion = 116,
  KeywordUnreachable = 117,
  KeywordUsingnamespace = 118,
  KeywordVar = 119,
  KeywordVolatile = 120,
  KeywordWhile = 121,
}
export const TokenTagMap: Record<TokenTag, string> = {
  [TokenTag.Invalid]: "invalid",
  [TokenTag.InvalidPeriodasterisks]: "invalid_periodasterisks",
  [TokenTag.Identifier]: "identifier",
  [TokenTag.StringLiteral]: "string_literal",
  [TokenTag.MultilineStringLiteralLine]: "multiline_string_literal_line",
  [TokenTag.CharLiteral]: "char_literal",
  [TokenTag.Eof]: "eof",
  [TokenTag.Builtin]: "builtin",
  [TokenTag.Bang]: "bang",
  [TokenTag.Pipe]: "pipe",
  [TokenTag.PipePipe]: "pipe_pipe",
  [TokenTag.PipeEqual]: "pipe_equal",
  [TokenTag.Equal]: "equal",
  [TokenTag.EqualEqual]: "equal_equal",
  [TokenTag.EqualAngleBracketRight]: "equal_angle_bracket_right",
  [TokenTag.BangEqual]: "bang_equal",
  [TokenTag.LParen]: "l_paren",
  [TokenTag.RParen]: "r_paren",
  [TokenTag.Semicolon]: "semicolon",
  [TokenTag.Percent]: "percent",
  [TokenTag.PercentEqual]: "percent_equal",
  [TokenTag.LBrace]: "l_brace",
  [TokenTag.RBrace]: "r_brace",
  [TokenTag.LBracket]: "l_bracket",
  [TokenTag.RBracket]: "r_bracket",
  [TokenTag.Period]: "period",
  [TokenTag.PeriodAsterisk]: "period_asterisk",
  [TokenTag.Ellipsis2]: "ellipsis2",
  [TokenTag.Ellipsis3]: "ellipsis3",
  [TokenTag.Caret]: "caret",
  [TokenTag.CaretEqual]: "caret_equal",
  [TokenTag.Plus]: "plus",
  [TokenTag.PlusPlus]: "plus_plus",
  [TokenTag.PlusEqual]: "plus_equal",
  [TokenTag.PlusPercent]: "plus_percent",
  [TokenTag.PlusPercentEqual]: "plus_percent_equal",
  [TokenTag.PlusPipe]: "plus_pipe",
  [TokenTag.PlusPipeEqual]: "plus_pipe_equal",
  [TokenTag.Minus]: "minus",
  [TokenTag.MinusEqual]: "minus_equal",
  [TokenTag.MinusPercent]: "minus_percent",
  [TokenTag.MinusPercentEqual]: "minus_percent_equal",
  [TokenTag.MinusPipe]: "minus_pipe",
  [TokenTag.MinusPipeEqual]: "minus_pipe_equal",
  [TokenTag.Asterisk]: "asterisk",
  [TokenTag.AsteriskEqual]: "asterisk_equal",
  [TokenTag.AsteriskAsterisk]: "asterisk_asterisk",
  [TokenTag.AsteriskPercent]: "asterisk_percent",
  [TokenTag.AsteriskPercentEqual]: "asterisk_percent_equal",
  [TokenTag.AsteriskPipe]: "asterisk_pipe",
  [TokenTag.AsteriskPipeEqual]: "asterisk_pipe_equal",
  [TokenTag.Arrow]: "arrow",
  [TokenTag.Colon]: "colon",
  [TokenTag.Slash]: "slash",
  [TokenTag.SlashEqual]: "slash_equal",
  [TokenTag.Comma]: "comma",
  [TokenTag.Ampersand]: "ampersand",
  [TokenTag.AmpersandEqual]: "ampersand_equal",
  [TokenTag.QuestionMark]: "question_mark",
  [TokenTag.AngleBracketLeft]: "angle_bracket_left",
  [TokenTag.AngleBracketLeftEqual]: "angle_bracket_left_equal",
  [TokenTag.AngleBracketAngleBracketLeft]: "angle_bracket_angle_bracket_left",
  [TokenTag.AngleBracketAngleBracketLeftEqual]:
    "angle_bracket_angle_bracket_left_equal",
  [TokenTag.AngleBracketAngleBracketLeftPipe]:
    "angle_bracket_angle_bracket_left_pipe",
  [TokenTag.AngleBracketAngleBracketLeftPipeEqual]:
    "angle_bracket_angle_bracket_left_pipe_equal",
  [TokenTag.AngleBracketRight]: "angle_bracket_right",
  [TokenTag.AngleBracketRightEqual]: "angle_bracket_right_equal",
  [TokenTag.AngleBracketAngleBracketRight]: "angle_bracket_angle_bracket_right",
  [TokenTag.AngleBracketAngleBracketRightEqual]:
    "angle_bracket_angle_bracket_right_equal",
  [TokenTag.Tilde]: "tilde",
  [TokenTag.NumberLiteral]: "number_literal",
  [TokenTag.DocComment]: "doc_comment",
  [TokenTag.ContainerDocComment]: "container_doc_comment",
  [TokenTag.KeywordAddrspace]: "keyword_addrspace",
  [TokenTag.KeywordAlign]: "keyword_align",
  [TokenTag.KeywordAllowzero]: "keyword_allowzero",
  [TokenTag.KeywordAnd]: "keyword_and",
  [TokenTag.KeywordAnyframe]: "keyword_anyframe",
  [TokenTag.KeywordAnytype]: "keyword_anytype",
  [TokenTag.KeywordAsm]: "keyword_asm",
  [TokenTag.KeywordAsync]: "keyword_async",
  [TokenTag.KeywordAwait]: "keyword_await",
  [TokenTag.KeywordBreak]: "keyword_break",
  [TokenTag.KeywordCallconv]: "keyword_callconv",
  [TokenTag.KeywordCatch]: "keyword_catch",
  [TokenTag.KeywordComptime]: "keyword_comptime",
  [TokenTag.KeywordConst]: "keyword_const",
  [TokenTag.KeywordContinue]: "keyword_continue",
  [TokenTag.KeywordDefer]: "keyword_defer",
  [TokenTag.KeywordElse]: "keyword_else",
  [TokenTag.KeywordEnum]: "keyword_enum",
  [TokenTag.KeywordErrdefer]: "keyword_errdefer",
  [TokenTag.KeywordError]: "keyword_error",
  [TokenTag.KeywordExport]: "keyword_export",
  [TokenTag.KeywordExtern]: "keyword_extern",
  [TokenTag.KeywordFn]: "keyword_fn",
  [TokenTag.KeywordFor]: "keyword_for",
  [TokenTag.KeywordIf]: "keyword_if",
  [TokenTag.KeywordInline]: "keyword_inline",
  [TokenTag.KeywordNoalias]: "keyword_noalias",
  [TokenTag.KeywordNoinline]: "keyword_noinline",
  [TokenTag.KeywordNosuspend]: "keyword_nosuspend",
  [TokenTag.KeywordOpaque]: "keyword_opaque",
  [TokenTag.KeywordOr]: "keyword_or",
  [TokenTag.KeywordOrelse]: "keyword_orelse",
  [TokenTag.KeywordPacked]: "keyword_packed",
  [TokenTag.KeywordPub]: "keyword_pub",
  [TokenTag.KeywordResume]: "keyword_resume",
  [TokenTag.KeywordReturn]: "keyword_return",
  [TokenTag.KeywordLinksection]: "keyword_linksection",
  [TokenTag.KeywordStruct]: "keyword_struct",
  [TokenTag.KeywordSuspend]: "keyword_suspend",
  [TokenTag.KeywordSwitch]: "keyword_switch",
  [TokenTag.KeywordTest]: "keyword_test",
  [TokenTag.KeywordThreadlocal]: "keyword_threadlocal",
  [TokenTag.KeywordTry]: "keyword_try",
  [TokenTag.KeywordUnion]: "keyword_union",
  [TokenTag.KeywordUnreachable]: "keyword_unreachable",
  [TokenTag.KeywordUsingnamespace]: "keyword_usingnamespace",
  [TokenTag.KeywordVar]: "keyword_var",
  [TokenTag.KeywordVolatile]: "keyword_volatile",
  [TokenTag.KeywordWhile]: "keyword_while",
};

export enum AstNodeTag {
  Root = 0,
  Usingnamespace = 1,
  TestDecl = 2,
  GlobalVarDecl = 3,
  LocalVarDecl = 4,
  SimpleVarDecl = 5,
  AlignedVarDecl = 6,
  Errdefer = 7,
  Defer = 8,
  Catch = 9,
  FieldAccess = 10,
  UnwrapOptional = 11,
  EqualEqual = 12,
  BangEqual = 13,
  LessThan = 14,
  GreaterThan = 15,
  LessOrEqual = 16,
  GreaterOrEqual = 17,
  AssignMul = 18,
  AssignDiv = 19,
  AssignMod = 20,
  AssignAdd = 21,
  AssignSub = 22,
  AssignShl = 23,
  AssignShlSat = 24,
  AssignShr = 25,
  AssignBitAnd = 26,
  AssignBitXor = 27,
  AssignBitOr = 28,
  AssignMulWrap = 29,
  AssignAddWrap = 30,
  AssignSubWrap = 31,
  AssignMulSat = 32,
  AssignAddSat = 33,
  AssignSubSat = 34,
  Assign = 35,
  AssignDestructure = 36,
  MergeErrorSets = 37,
  Mul = 38,
  Div = 39,
  Mod = 40,
  ArrayMult = 41,
  MulWrap = 42,
  MulSat = 43,
  Add = 44,
  Sub = 45,
  ArrayCat = 46,
  AddWrap = 47,
  SubWrap = 48,
  AddSat = 49,
  SubSat = 50,
  Shl = 51,
  ShlSat = 52,
  Shr = 53,
  BitAnd = 54,
  BitXor = 55,
  BitOr = 56,
  Orelse = 57,
  BoolAnd = 58,
  BoolOr = 59,
  BoolNot = 60,
  Negation = 61,
  BitNot = 62,
  NegationWrap = 63,
  AddressOf = 64,
  Try = 65,
  Await = 66,
  OptionalType = 67,
  ArrayType = 68,
  ArrayTypeSentinel = 69,
  PtrTypeAligned = 70,
  PtrTypeSentinel = 71,
  PtrType = 72,
  PtrTypeBitRange = 73,
  SliceOpen = 74,
  Slice = 75,
  SliceSentinel = 76,
  Deref = 77,
  ArrayAccess = 78,
  ArrayInitOne = 79,
  ArrayInitOneComma = 80,
  ArrayInitDotTwo = 81,
  ArrayInitDotTwoComma = 82,
  ArrayInitDot = 83,
  ArrayInitDotComma = 84,
  ArrayInit = 85,
  ArrayInitComma = 86,
  StructInitOne = 87,
  StructInitOneComma = 88,
  StructInitDotTwo = 89,
  StructInitDotTwoComma = 90,
  StructInitDot = 91,
  StructInitDotComma = 92,
  StructInit = 93,
  StructInitComma = 94,
  CallOne = 95,
  CallOneComma = 96,
  AsyncCallOne = 97,
  AsyncCallOneComma = 98,
  Call = 99,
  CallComma = 100,
  AsyncCall = 101,
  AsyncCallComma = 102,
  Switch = 103,
  SwitchComma = 104,
  SwitchCaseOne = 105,
  SwitchCaseInlineOne = 106,
  SwitchCase = 107,
  SwitchCaseInline = 108,
  SwitchRange = 109,
  WhileSimple = 110,
  WhileCont = 111,
  While = 112,
  ForSimple = 113,
  For = 114,
  ForRange = 115,
  IfSimple = 116,
  If = 117,
  Suspend = 118,
  Resume = 119,
  Continue = 120,
  Break = 121,
  Return = 122,
  FnProtoSimple = 123,
  FnProtoMulti = 124,
  FnProtoOne = 125,
  FnProto = 126,
  FnDecl = 127,
  AnyframeType = 128,
  AnyframeLiteral = 129,
  CharLiteral = 130,
  NumberLiteral = 131,
  UnreachableLiteral = 132,
  Identifier = 133,
  EnumLiteral = 134,
  StringLiteral = 135,
  MultilineStringLiteral = 136,
  GroupedExpression = 137,
  BuiltinCallTwo = 138,
  BuiltinCallTwoComma = 139,
  BuiltinCall = 140,
  BuiltinCallComma = 141,
  ErrorSetDecl = 142,
  ContainerDecl = 143,
  ContainerDeclTrailing = 144,
  ContainerDeclTwo = 145,
  ContainerDeclTwoTrailing = 146,
  ContainerDeclArg = 147,
  ContainerDeclArgTrailing = 148,
  TaggedUnion = 149,
  TaggedUnionTrailing = 150,
  TaggedUnionTwo = 151,
  TaggedUnionTwoTrailing = 152,
  TaggedUnionEnumTag = 153,
  TaggedUnionEnumTagTrailing = 154,
  ContainerFieldInit = 155,
  ContainerFieldAlign = 156,
  ContainerField = 157,
  Comptime = 158,
  Nosuspend = 159,
  BlockTwo = 160,
  BlockTwoSemicolon = 161,
  Block = 162,
  BlockSemicolon = 163,
  AsmSimple = 164,
  Asm = 165,
  AsmOutput = 166,
  AsmInput = 167,
  ErrorValue = 168,
  ErrorUnion = 169,
}
export const AstNodeTagMap: Record<AstNodeTag, string> = {
  [AstNodeTag.Root]: "root",
  [AstNodeTag.Usingnamespace]: "usingnamespace",
  [AstNodeTag.TestDecl]: "test_decl",
  [AstNodeTag.GlobalVarDecl]: "global_var_decl",
  [AstNodeTag.LocalVarDecl]: "local_var_decl",
  [AstNodeTag.SimpleVarDecl]: "simple_var_decl",
  [AstNodeTag.AlignedVarDecl]: "aligned_var_decl",
  [AstNodeTag.Errdefer]: "errdefer",
  [AstNodeTag.Defer]: "defer",
  [AstNodeTag.Catch]: "catch",
  [AstNodeTag.FieldAccess]: "field_access",
  [AstNodeTag.UnwrapOptional]: "unwrap_optional",
  [AstNodeTag.EqualEqual]: "equal_equal",
  [AstNodeTag.BangEqual]: "bang_equal",
  [AstNodeTag.LessThan]: "less_than",
  [AstNodeTag.GreaterThan]: "greater_than",
  [AstNodeTag.LessOrEqual]: "less_or_equal",
  [AstNodeTag.GreaterOrEqual]: "greater_or_equal",
  [AstNodeTag.AssignMul]: "assign_mul",
  [AstNodeTag.AssignDiv]: "assign_div",
  [AstNodeTag.AssignMod]: "assign_mod",
  [AstNodeTag.AssignAdd]: "assign_add",
  [AstNodeTag.AssignSub]: "assign_sub",
  [AstNodeTag.AssignShl]: "assign_shl",
  [AstNodeTag.AssignShlSat]: "assign_shl_sat",
  [AstNodeTag.AssignShr]: "assign_shr",
  [AstNodeTag.AssignBitAnd]: "assign_bit_and",
  [AstNodeTag.AssignBitXor]: "assign_bit_xor",
  [AstNodeTag.AssignBitOr]: "assign_bit_or",
  [AstNodeTag.AssignMulWrap]: "assign_mul_wrap",
  [AstNodeTag.AssignAddWrap]: "assign_add_wrap",
  [AstNodeTag.AssignSubWrap]: "assign_sub_wrap",
  [AstNodeTag.AssignMulSat]: "assign_mul_sat",
  [AstNodeTag.AssignAddSat]: "assign_add_sat",
  [AstNodeTag.AssignSubSat]: "assign_sub_sat",
  [AstNodeTag.Assign]: "assign",
  [AstNodeTag.AssignDestructure]: "assign_destructure",
  [AstNodeTag.MergeErrorSets]: "merge_error_sets",
  [AstNodeTag.Mul]: "mul",
  [AstNodeTag.Div]: "div",
  [AstNodeTag.Mod]: "mod",
  [AstNodeTag.ArrayMult]: "array_mult",
  [AstNodeTag.MulWrap]: "mul_wrap",
  [AstNodeTag.MulSat]: "mul_sat",
  [AstNodeTag.Add]: "add",
  [AstNodeTag.Sub]: "sub",
  [AstNodeTag.ArrayCat]: "array_cat",
  [AstNodeTag.AddWrap]: "add_wrap",
  [AstNodeTag.SubWrap]: "sub_wrap",
  [AstNodeTag.AddSat]: "add_sat",
  [AstNodeTag.SubSat]: "sub_sat",
  [AstNodeTag.Shl]: "shl",
  [AstNodeTag.ShlSat]: "shl_sat",
  [AstNodeTag.Shr]: "shr",
  [AstNodeTag.BitAnd]: "bit_and",
  [AstNodeTag.BitXor]: "bit_xor",
  [AstNodeTag.BitOr]: "bit_or",
  [AstNodeTag.Orelse]: "orelse",
  [AstNodeTag.BoolAnd]: "bool_and",
  [AstNodeTag.BoolOr]: "bool_or",
  [AstNodeTag.BoolNot]: "bool_not",
  [AstNodeTag.Negation]: "negation",
  [AstNodeTag.BitNot]: "bit_not",
  [AstNodeTag.NegationWrap]: "negation_wrap",
  [AstNodeTag.AddressOf]: "address_of",
  [AstNodeTag.Try]: "try",
  [AstNodeTag.Await]: "await",
  [AstNodeTag.OptionalType]: "optional_type",
  [AstNodeTag.ArrayType]: "array_type",
  [AstNodeTag.ArrayTypeSentinel]: "array_type_sentinel",
  [AstNodeTag.PtrTypeAligned]: "ptr_type_aligned",
  [AstNodeTag.PtrTypeSentinel]: "ptr_type_sentinel",
  [AstNodeTag.PtrType]: "ptr_type",
  [AstNodeTag.PtrTypeBitRange]: "ptr_type_bit_range",
  [AstNodeTag.SliceOpen]: "slice_open",
  [AstNodeTag.Slice]: "slice",
  [AstNodeTag.SliceSentinel]: "slice_sentinel",
  [AstNodeTag.Deref]: "deref",
  [AstNodeTag.ArrayAccess]: "array_access",
  [AstNodeTag.ArrayInitOne]: "array_init_one",
  [AstNodeTag.ArrayInitOneComma]: "array_init_one_comma",
  [AstNodeTag.ArrayInitDotTwo]: "array_init_dot_two",
  [AstNodeTag.ArrayInitDotTwoComma]: "array_init_dot_two_comma",
  [AstNodeTag.ArrayInitDot]: "array_init_dot",
  [AstNodeTag.ArrayInitDotComma]: "array_init_dot_comma",
  [AstNodeTag.ArrayInit]: "array_init",
  [AstNodeTag.ArrayInitComma]: "array_init_comma",
  [AstNodeTag.StructInitOne]: "struct_init_one",
  [AstNodeTag.StructInitOneComma]: "struct_init_one_comma",
  [AstNodeTag.StructInitDotTwo]: "struct_init_dot_two",
  [AstNodeTag.StructInitDotTwoComma]: "struct_init_dot_two_comma",
  [AstNodeTag.StructInitDot]: "struct_init_dot",
  [AstNodeTag.StructInitDotComma]: "struct_init_dot_comma",
  [AstNodeTag.StructInit]: "struct_init",
  [AstNodeTag.StructInitComma]: "struct_init_comma",
  [AstNodeTag.CallOne]: "call_one",
  [AstNodeTag.CallOneComma]: "call_one_comma",
  [AstNodeTag.AsyncCallOne]: "async_call_one",
  [AstNodeTag.AsyncCallOneComma]: "async_call_one_comma",
  [AstNodeTag.Call]: "call",
  [AstNodeTag.CallComma]: "call_comma",
  [AstNodeTag.AsyncCall]: "async_call",
  [AstNodeTag.AsyncCallComma]: "async_call_comma",
  [AstNodeTag.Switch]: "switch",
  [AstNodeTag.SwitchComma]: "switch_comma",
  [AstNodeTag.SwitchCaseOne]: "switch_case_one",
  [AstNodeTag.SwitchCaseInlineOne]: "switch_case_inline_one",
  [AstNodeTag.SwitchCase]: "switch_case",
  [AstNodeTag.SwitchCaseInline]: "switch_case_inline",
  [AstNodeTag.SwitchRange]: "switch_range",
  [AstNodeTag.WhileSimple]: "while_simple",
  [AstNodeTag.WhileCont]: "while_cont",
  [AstNodeTag.While]: "while",
  [AstNodeTag.ForSimple]: "for_simple",
  [AstNodeTag.For]: "for",
  [AstNodeTag.ForRange]: "for_range",
  [AstNodeTag.IfSimple]: "if_simple",
  [AstNodeTag.If]: "if",
  [AstNodeTag.Suspend]: "suspend",
  [AstNodeTag.Resume]: "resume",
  [AstNodeTag.Continue]: "continue",
  [AstNodeTag.Break]: "break",
  [AstNodeTag.Return]: "return",
  [AstNodeTag.FnProtoSimple]: "fn_proto_simple",
  [AstNodeTag.FnProtoMulti]: "fn_proto_multi",
  [AstNodeTag.FnProtoOne]: "fn_proto_one",
  [AstNodeTag.FnProto]: "fn_proto",
  [AstNodeTag.FnDecl]: "fn_decl",
  [AstNodeTag.AnyframeType]: "anyframe_type",
  [AstNodeTag.AnyframeLiteral]: "anyframe_literal",
  [AstNodeTag.CharLiteral]: "char_literal",
  [AstNodeTag.NumberLiteral]: "number_literal",
  [AstNodeTag.UnreachableLiteral]: "unreachable_literal",
  [AstNodeTag.Identifier]: "identifier",
  [AstNodeTag.EnumLiteral]: "enum_literal",
  [AstNodeTag.StringLiteral]: "string_literal",
  [AstNodeTag.MultilineStringLiteral]: "multiline_string_literal",
  [AstNodeTag.GroupedExpression]: "grouped_expression",
  [AstNodeTag.BuiltinCallTwo]: "builtin_call_two",
  [AstNodeTag.BuiltinCallTwoComma]: "builtin_call_two_comma",
  [AstNodeTag.BuiltinCall]: "builtin_call",
  [AstNodeTag.BuiltinCallComma]: "builtin_call_comma",
  [AstNodeTag.ErrorSetDecl]: "error_set_decl",
  [AstNodeTag.ContainerDecl]: "container_decl",
  [AstNodeTag.ContainerDeclTrailing]: "container_decl_trailing",
  [AstNodeTag.ContainerDeclTwo]: "container_decl_two",
  [AstNodeTag.ContainerDeclTwoTrailing]: "container_decl_two_trailing",
  [AstNodeTag.ContainerDeclArg]: "container_decl_arg",
  [AstNodeTag.ContainerDeclArgTrailing]: "container_decl_arg_trailing",
  [AstNodeTag.TaggedUnion]: "tagged_union",
  [AstNodeTag.TaggedUnionTrailing]: "tagged_union_trailing",
  [AstNodeTag.TaggedUnionTwo]: "tagged_union_two",
  [AstNodeTag.TaggedUnionTwoTrailing]: "tagged_union_two_trailing",
  [AstNodeTag.TaggedUnionEnumTag]: "tagged_union_enum_tag",
  [AstNodeTag.TaggedUnionEnumTagTrailing]: "tagged_union_enum_tag_trailing",
  [AstNodeTag.ContainerFieldInit]: "container_field_init",
  [AstNodeTag.ContainerFieldAlign]: "container_field_align",
  [AstNodeTag.ContainerField]: "container_field",
  [AstNodeTag.Comptime]: "comptime",
  [AstNodeTag.Nosuspend]: "nosuspend",
  [AstNodeTag.BlockTwo]: "block_two",
  [AstNodeTag.BlockTwoSemicolon]: "block_two_semicolon",
  [AstNodeTag.Block]: "block",
  [AstNodeTag.BlockSemicolon]: "block_semicolon",
  [AstNodeTag.AsmSimple]: "asm_simple",
  [AstNodeTag.Asm]: "asm",
  [AstNodeTag.AsmOutput]: "asm_output",
  [AstNodeTag.AsmInput]: "asm_input",
  [AstNodeTag.ErrorValue]: "error_value",
  [AstNodeTag.ErrorUnion]: "error_union",
};

export type AstSpan = {
  start: number;
  end: number;
  main: number;
};

export enum ZirInstTag {
  Add = 0,
  Addwrap = 1,
  AddSat = 2,
  AddUnsafe = 3,
  Sub = 4,
  Subwrap = 5,
  SubSat = 6,
  Mul = 7,
  Mulwrap = 8,
  MulSat = 9,
  DivExact = 10,
  DivFloor = 11,
  DivTrunc = 12,
  Mod = 13,
  Rem = 14,
  ModRem = 15,
  Shl = 16,
  ShlExact = 17,
  ShlSat = 18,
  Shr = 19,
  ShrExact = 20,
  Param = 21,
  ParamComptime = 22,
  ParamAnytype = 23,
  ParamAnytypeComptime = 24,
  ArrayCat = 25,
  ArrayMul = 26,
  ArrayType = 27,
  ArrayTypeSentinel = 28,
  VectorType = 29,
  ElemType = 30,
  IndexablePtrElemType = 31,
  VectorElemType = 32,
  IndexablePtrLen = 33,
  AnyframeType = 34,
  AsNode = 35,
  AsShiftOperand = 36,
  BitAnd = 37,
  Bitcast = 38,
  BitNot = 39,
  BitOr = 40,
  Block = 41,
  BlockComptime = 42,
  BlockInline = 43,
  Declaration = 44,
  SuspendBlock = 45,
  BoolNot = 46,
  BoolBrAnd = 47,
  BoolBrOr = 48,
  Break = 49,
  BreakInline = 50,
  CheckComptimeControlFlow = 51,
  Call = 52,
  FieldCall = 53,
  BuiltinCall = 54,
  CmpLt = 55,
  CmpLte = 56,
  CmpEq = 57,
  CmpGte = 58,
  CmpGt = 59,
  CmpNeq = 60,
  Condbr = 61,
  CondbrInline = 62,
  Try = 63,
  TryPtr = 64,
  ErrorSetDecl = 65,
  DbgStmt = 66,
  DbgVarPtr = 67,
  DbgVarVal = 68,
  DeclRef = 69,
  DeclVal = 70,
  Load = 71,
  Div = 72,
  ElemPtrNode = 73,
  ElemPtr = 74,
  ElemValNode = 75,
  ElemVal = 76,
  ElemValImm = 77,
  EnsureResultUsed = 78,
  EnsureResultNonError = 79,
  EnsureErrUnionPayloadVoid = 80,
  ErrorUnionType = 81,
  ErrorValue = 82,
  Export = 83,
  ExportValue = 84,
  FieldPtr = 85,
  FieldVal = 86,
  FieldPtrNamed = 87,
  FieldValNamed = 88,
  Func = 89,
  FuncInferred = 90,
  FuncFancy = 91,
  Import = 92,
  Int = 93,
  IntBig = 94,
  Float = 95,
  Float128 = 96,
  IntType = 97,
  IsNonNull = 98,
  IsNonNullPtr = 99,
  IsNonErr = 100,
  IsNonErrPtr = 101,
  RetIsNonErr = 102,
  Loop = 103,
  Repeat = 104,
  RepeatInline = 105,
  ForLen = 106,
  MergeErrorSets = 107,
  Ref = 108,
  RetNode = 109,
  RetLoad = 110,
  RetImplicit = 111,
  RetErrValue = 112,
  RetErrValueCode = 113,
  RetPtr = 114,
  RetType = 115,
  PtrType = 116,
  SliceStart = 117,
  SliceEnd = 118,
  SliceSentinel = 119,
  SliceLength = 120,
  StoreNode = 121,
  StoreToInferredPtr = 122,
  Str = 123,
  Negate = 124,
  NegateWrap = 125,
  Typeof = 126,
  TypeofBuiltin = 127,
  TypeofLog2IntType = 128,
  Unreachable = 129,
  Xor = 130,
  OptionalType = 131,
  OptionalPayloadSafe = 132,
  OptionalPayloadUnsafe = 133,
  OptionalPayloadSafePtr = 134,
  OptionalPayloadUnsafePtr = 135,
  ErrUnionPayloadUnsafe = 136,
  ErrUnionPayloadUnsafePtr = 137,
  ErrUnionCode = 138,
  ErrUnionCodePtr = 139,
  EnumLiteral = 140,
  SwitchBlock = 141,
  SwitchBlockRef = 142,
  SwitchBlockErrUnion = 143,
  ValidateDeref = 144,
  ValidateDestructure = 145,
  FieldTypeRef = 146,
  OptEuBasePtrInit = 147,
  CoercePtrElemTy = 148,
  ValidateRefTy = 149,
  StructInitEmpty = 150,
  StructInitEmptyResult = 151,
  StructInitEmptyRefResult = 152,
  StructInitAnon = 153,
  StructInit = 154,
  StructInitRef = 155,
  ValidateStructInitTy = 156,
  ValidateStructInitResultTy = 157,
  ValidatePtrStructInit = 158,
  StructInitFieldType = 159,
  StructInitFieldPtr = 160,
  ArrayInitAnon = 161,
  ArrayInit = 162,
  ArrayInitRef = 163,
  ValidateArrayInitTy = 164,
  ValidateArrayInitResultTy = 165,
  ValidateArrayInitRefTy = 166,
  ValidatePtrArrayInit = 167,
  ArrayInitElemType = 168,
  ArrayInitElemPtr = 169,
  UnionInit = 170,
  TypeInfo = 171,
  SizeOf = 172,
  BitSizeOf = 173,
  IntFromPtr = 174,
  CompileError = 175,
  SetEvalBranchQuota = 176,
  IntFromEnum = 177,
  AlignOf = 178,
  IntFromBool = 179,
  EmbedFile = 180,
  ErrorName = 181,
  Panic = 182,
  Trap = 183,
  SetRuntimeSafety = 184,
  Sqrt = 185,
  Sin = 186,
  Cos = 187,
  Tan = 188,
  Exp = 189,
  Exp2 = 190,
  Log = 191,
  Log2 = 192,
  Log10 = 193,
  Abs = 194,
  Floor = 195,
  Ceil = 196,
  Trunc = 197,
  Round = 198,
  TagName = 199,
  TypeName = 200,
  FrameType = 201,
  FrameSize = 202,
  IntFromFloat = 203,
  FloatFromInt = 204,
  PtrFromInt = 205,
  EnumFromInt = 206,
  FloatCast = 207,
  IntCast = 208,
  PtrCast = 209,
  Truncate = 210,
  HasDecl = 211,
  HasField = 212,
  Clz = 213,
  Ctz = 214,
  PopCount = 215,
  ByteSwap = 216,
  BitReverse = 217,
  BitOffsetOf = 218,
  OffsetOf = 219,
  Splat = 220,
  Reduce = 221,
  Shuffle = 222,
  AtomicLoad = 223,
  AtomicRmw = 224,
  AtomicStore = 225,
  MulAdd = 226,
  Memcpy = 227,
  Memset = 228,
  Min = 229,
  Max = 230,
  CImport = 231,
  Alloc = 232,
  AllocMut = 233,
  AllocComptimeMut = 234,
  AllocInferred = 235,
  AllocInferredMut = 236,
  AllocInferredComptime = 237,
  AllocInferredComptimeMut = 238,
  ResolveInferredAlloc = 239,
  MakePtrConst = 240,
  Resume = 241,
  Await = 242,
  Defer = 243,
  DeferErrCode = 244,
  SaveErrRetIndex = 245,
  RestoreErrRetIndexUnconditional = 246,
  RestoreErrRetIndexFnEntry = 247,
  Extended = 248,
}
export const ZirInstTagMap: Record<ZirInstTag, string> = {
  [ZirInstTag.Add]: "add",
  [ZirInstTag.Addwrap]: "addwrap",
  [ZirInstTag.AddSat]: "add_sat",
  [ZirInstTag.AddUnsafe]: "add_unsafe",
  [ZirInstTag.Sub]: "sub",
  [ZirInstTag.Subwrap]: "subwrap",
  [ZirInstTag.SubSat]: "sub_sat",
  [ZirInstTag.Mul]: "mul",
  [ZirInstTag.Mulwrap]: "mulwrap",
  [ZirInstTag.MulSat]: "mul_sat",
  [ZirInstTag.DivExact]: "div_exact",
  [ZirInstTag.DivFloor]: "div_floor",
  [ZirInstTag.DivTrunc]: "div_trunc",
  [ZirInstTag.Mod]: "mod",
  [ZirInstTag.Rem]: "rem",
  [ZirInstTag.ModRem]: "mod_rem",
  [ZirInstTag.Shl]: "shl",
  [ZirInstTag.ShlExact]: "shl_exact",
  [ZirInstTag.ShlSat]: "shl_sat",
  [ZirInstTag.Shr]: "shr",
  [ZirInstTag.ShrExact]: "shr_exact",
  [ZirInstTag.Param]: "param",
  [ZirInstTag.ParamComptime]: "param_comptime",
  [ZirInstTag.ParamAnytype]: "param_anytype",
  [ZirInstTag.ParamAnytypeComptime]: "param_anytype_comptime",
  [ZirInstTag.ArrayCat]: "array_cat",
  [ZirInstTag.ArrayMul]: "array_mul",
  [ZirInstTag.ArrayType]: "array_type",
  [ZirInstTag.ArrayTypeSentinel]: "array_type_sentinel",
  [ZirInstTag.VectorType]: "vector_type",
  [ZirInstTag.ElemType]: "elem_type",
  [ZirInstTag.IndexablePtrElemType]: "indexable_ptr_elem_type",
  [ZirInstTag.VectorElemType]: "vector_elem_type",
  [ZirInstTag.IndexablePtrLen]: "indexable_ptr_len",
  [ZirInstTag.AnyframeType]: "anyframe_type",
  [ZirInstTag.AsNode]: "as_node",
  [ZirInstTag.AsShiftOperand]: "as_shift_operand",
  [ZirInstTag.BitAnd]: "bit_and",
  [ZirInstTag.Bitcast]: "bitcast",
  [ZirInstTag.BitNot]: "bit_not",
  [ZirInstTag.BitOr]: "bit_or",
  [ZirInstTag.Block]: "block",
  [ZirInstTag.BlockComptime]: "block_comptime",
  [ZirInstTag.BlockInline]: "block_inline",
  [ZirInstTag.Declaration]: "declaration",
  [ZirInstTag.SuspendBlock]: "suspend_block",
  [ZirInstTag.BoolNot]: "bool_not",
  [ZirInstTag.BoolBrAnd]: "bool_br_and",
  [ZirInstTag.BoolBrOr]: "bool_br_or",
  [ZirInstTag.Break]: "break",
  [ZirInstTag.BreakInline]: "break_inline",
  [ZirInstTag.CheckComptimeControlFlow]: "check_comptime_control_flow",
  [ZirInstTag.Call]: "call",
  [ZirInstTag.FieldCall]: "field_call",
  [ZirInstTag.BuiltinCall]: "builtin_call",
  [ZirInstTag.CmpLt]: "cmp_lt",
  [ZirInstTag.CmpLte]: "cmp_lte",
  [ZirInstTag.CmpEq]: "cmp_eq",
  [ZirInstTag.CmpGte]: "cmp_gte",
  [ZirInstTag.CmpGt]: "cmp_gt",
  [ZirInstTag.CmpNeq]: "cmp_neq",
  [ZirInstTag.Condbr]: "condbr",
  [ZirInstTag.CondbrInline]: "condbr_inline",
  [ZirInstTag.Try]: "try",
  [ZirInstTag.TryPtr]: "try_ptr",
  [ZirInstTag.ErrorSetDecl]: "error_set_decl",
  [ZirInstTag.DbgStmt]: "dbg_stmt",
  [ZirInstTag.DbgVarPtr]: "dbg_var_ptr",
  [ZirInstTag.DbgVarVal]: "dbg_var_val",
  [ZirInstTag.DeclRef]: "decl_ref",
  [ZirInstTag.DeclVal]: "decl_val",
  [ZirInstTag.Load]: "load",
  [ZirInstTag.Div]: "div",
  [ZirInstTag.ElemPtrNode]: "elem_ptr_node",
  [ZirInstTag.ElemPtr]: "elem_ptr",
  [ZirInstTag.ElemValNode]: "elem_val_node",
  [ZirInstTag.ElemVal]: "elem_val",
  [ZirInstTag.ElemValImm]: "elem_val_imm",
  [ZirInstTag.EnsureResultUsed]: "ensure_result_used",
  [ZirInstTag.EnsureResultNonError]: "ensure_result_non_error",
  [ZirInstTag.EnsureErrUnionPayloadVoid]: "ensure_err_union_payload_void",
  [ZirInstTag.ErrorUnionType]: "error_union_type",
  [ZirInstTag.ErrorValue]: "error_value",
  [ZirInstTag.Export]: "export",
  [ZirInstTag.ExportValue]: "export_value",
  [ZirInstTag.FieldPtr]: "field_ptr",
  [ZirInstTag.FieldVal]: "field_val",
  [ZirInstTag.FieldPtrNamed]: "field_ptr_named",
  [ZirInstTag.FieldValNamed]: "field_val_named",
  [ZirInstTag.Func]: "func",
  [ZirInstTag.FuncInferred]: "func_inferred",
  [ZirInstTag.FuncFancy]: "func_fancy",
  [ZirInstTag.Import]: "import",
  [ZirInstTag.Int]: "int",
  [ZirInstTag.IntBig]: "int_big",
  [ZirInstTag.Float]: "float",
  [ZirInstTag.Float128]: "float128",
  [ZirInstTag.IntType]: "int_type",
  [ZirInstTag.IsNonNull]: "is_non_null",
  [ZirInstTag.IsNonNullPtr]: "is_non_null_ptr",
  [ZirInstTag.IsNonErr]: "is_non_err",
  [ZirInstTag.IsNonErrPtr]: "is_non_err_ptr",
  [ZirInstTag.RetIsNonErr]: "ret_is_non_err",
  [ZirInstTag.Loop]: "loop",
  [ZirInstTag.Repeat]: "repeat",
  [ZirInstTag.RepeatInline]: "repeat_inline",
  [ZirInstTag.ForLen]: "for_len",
  [ZirInstTag.MergeErrorSets]: "merge_error_sets",
  [ZirInstTag.Ref]: "ref",
  [ZirInstTag.RetNode]: "ret_node",
  [ZirInstTag.RetLoad]: "ret_load",
  [ZirInstTag.RetImplicit]: "ret_implicit",
  [ZirInstTag.RetErrValue]: "ret_err_value",
  [ZirInstTag.RetErrValueCode]: "ret_err_value_code",
  [ZirInstTag.RetPtr]: "ret_ptr",
  [ZirInstTag.RetType]: "ret_type",
  [ZirInstTag.PtrType]: "ptr_type",
  [ZirInstTag.SliceStart]: "slice_start",
  [ZirInstTag.SliceEnd]: "slice_end",
  [ZirInstTag.SliceSentinel]: "slice_sentinel",
  [ZirInstTag.SliceLength]: "slice_length",
  [ZirInstTag.StoreNode]: "store_node",
  [ZirInstTag.StoreToInferredPtr]: "store_to_inferred_ptr",
  [ZirInstTag.Str]: "str",
  [ZirInstTag.Negate]: "negate",
  [ZirInstTag.NegateWrap]: "negate_wrap",
  [ZirInstTag.Typeof]: "typeof",
  [ZirInstTag.TypeofBuiltin]: "typeof_builtin",
  [ZirInstTag.TypeofLog2IntType]: "typeof_log2_int_type",
  [ZirInstTag.Unreachable]: "unreachable",
  [ZirInstTag.Xor]: "xor",
  [ZirInstTag.OptionalType]: "optional_type",
  [ZirInstTag.OptionalPayloadSafe]: "optional_payload_safe",
  [ZirInstTag.OptionalPayloadUnsafe]: "optional_payload_unsafe",
  [ZirInstTag.OptionalPayloadSafePtr]: "optional_payload_safe_ptr",
  [ZirInstTag.OptionalPayloadUnsafePtr]: "optional_payload_unsafe_ptr",
  [ZirInstTag.ErrUnionPayloadUnsafe]: "err_union_payload_unsafe",
  [ZirInstTag.ErrUnionPayloadUnsafePtr]: "err_union_payload_unsafe_ptr",
  [ZirInstTag.ErrUnionCode]: "err_union_code",
  [ZirInstTag.ErrUnionCodePtr]: "err_union_code_ptr",
  [ZirInstTag.EnumLiteral]: "enum_literal",
  [ZirInstTag.SwitchBlock]: "switch_block",
  [ZirInstTag.SwitchBlockRef]: "switch_block_ref",
  [ZirInstTag.SwitchBlockErrUnion]: "switch_block_err_union",
  [ZirInstTag.ValidateDeref]: "validate_deref",
  [ZirInstTag.ValidateDestructure]: "validate_destructure",
  [ZirInstTag.FieldTypeRef]: "field_type_ref",
  [ZirInstTag.OptEuBasePtrInit]: "opt_eu_base_ptr_init",
  [ZirInstTag.CoercePtrElemTy]: "coerce_ptr_elem_ty",
  [ZirInstTag.ValidateRefTy]: "validate_ref_ty",
  [ZirInstTag.StructInitEmpty]: "struct_init_empty",
  [ZirInstTag.StructInitEmptyResult]: "struct_init_empty_result",
  [ZirInstTag.StructInitEmptyRefResult]: "struct_init_empty_ref_result",
  [ZirInstTag.StructInitAnon]: "struct_init_anon",
  [ZirInstTag.StructInit]: "struct_init",
  [ZirInstTag.StructInitRef]: "struct_init_ref",
  [ZirInstTag.ValidateStructInitTy]: "validate_struct_init_ty",
  [ZirInstTag.ValidateStructInitResultTy]: "validate_struct_init_result_ty",
  [ZirInstTag.ValidatePtrStructInit]: "validate_ptr_struct_init",
  [ZirInstTag.StructInitFieldType]: "struct_init_field_type",
  [ZirInstTag.StructInitFieldPtr]: "struct_init_field_ptr",
  [ZirInstTag.ArrayInitAnon]: "array_init_anon",
  [ZirInstTag.ArrayInit]: "array_init",
  [ZirInstTag.ArrayInitRef]: "array_init_ref",
  [ZirInstTag.ValidateArrayInitTy]: "validate_array_init_ty",
  [ZirInstTag.ValidateArrayInitResultTy]: "validate_array_init_result_ty",
  [ZirInstTag.ValidateArrayInitRefTy]: "validate_array_init_ref_ty",
  [ZirInstTag.ValidatePtrArrayInit]: "validate_ptr_array_init",
  [ZirInstTag.ArrayInitElemType]: "array_init_elem_type",
  [ZirInstTag.ArrayInitElemPtr]: "array_init_elem_ptr",
  [ZirInstTag.UnionInit]: "union_init",
  [ZirInstTag.TypeInfo]: "type_info",
  [ZirInstTag.SizeOf]: "size_of",
  [ZirInstTag.BitSizeOf]: "bit_size_of",
  [ZirInstTag.IntFromPtr]: "int_from_ptr",
  [ZirInstTag.CompileError]: "compile_error",
  [ZirInstTag.SetEvalBranchQuota]: "set_eval_branch_quota",
  [ZirInstTag.IntFromEnum]: "int_from_enum",
  [ZirInstTag.AlignOf]: "align_of",
  [ZirInstTag.IntFromBool]: "int_from_bool",
  [ZirInstTag.EmbedFile]: "embed_file",
  [ZirInstTag.ErrorName]: "error_name",
  [ZirInstTag.Panic]: "panic",
  [ZirInstTag.Trap]: "trap",
  [ZirInstTag.SetRuntimeSafety]: "set_runtime_safety",
  [ZirInstTag.Sqrt]: "sqrt",
  [ZirInstTag.Sin]: "sin",
  [ZirInstTag.Cos]: "cos",
  [ZirInstTag.Tan]: "tan",
  [ZirInstTag.Exp]: "exp",
  [ZirInstTag.Exp2]: "exp2",
  [ZirInstTag.Log]: "log",
  [ZirInstTag.Log2]: "log2",
  [ZirInstTag.Log10]: "log10",
  [ZirInstTag.Abs]: "abs",
  [ZirInstTag.Floor]: "floor",
  [ZirInstTag.Ceil]: "ceil",
  [ZirInstTag.Trunc]: "trunc",
  [ZirInstTag.Round]: "round",
  [ZirInstTag.TagName]: "tag_name",
  [ZirInstTag.TypeName]: "type_name",
  [ZirInstTag.FrameType]: "frame_type",
  [ZirInstTag.FrameSize]: "frame_size",
  [ZirInstTag.IntFromFloat]: "int_from_float",
  [ZirInstTag.FloatFromInt]: "float_from_int",
  [ZirInstTag.PtrFromInt]: "ptr_from_int",
  [ZirInstTag.EnumFromInt]: "enum_from_int",
  [ZirInstTag.FloatCast]: "float_cast",
  [ZirInstTag.IntCast]: "int_cast",
  [ZirInstTag.PtrCast]: "ptr_cast",
  [ZirInstTag.Truncate]: "truncate",
  [ZirInstTag.HasDecl]: "has_decl",
  [ZirInstTag.HasField]: "has_field",
  [ZirInstTag.Clz]: "clz",
  [ZirInstTag.Ctz]: "ctz",
  [ZirInstTag.PopCount]: "pop_count",
  [ZirInstTag.ByteSwap]: "byte_swap",
  [ZirInstTag.BitReverse]: "bit_reverse",
  [ZirInstTag.BitOffsetOf]: "bit_offset_of",
  [ZirInstTag.OffsetOf]: "offset_of",
  [ZirInstTag.Splat]: "splat",
  [ZirInstTag.Reduce]: "reduce",
  [ZirInstTag.Shuffle]: "shuffle",
  [ZirInstTag.AtomicLoad]: "atomic_load",
  [ZirInstTag.AtomicRmw]: "atomic_rmw",
  [ZirInstTag.AtomicStore]: "atomic_store",
  [ZirInstTag.MulAdd]: "mul_add",
  [ZirInstTag.Memcpy]: "memcpy",
  [ZirInstTag.Memset]: "memset",
  [ZirInstTag.Min]: "min",
  [ZirInstTag.Max]: "max",
  [ZirInstTag.CImport]: "c_import",
  [ZirInstTag.Alloc]: "alloc",
  [ZirInstTag.AllocMut]: "alloc_mut",
  [ZirInstTag.AllocComptimeMut]: "alloc_comptime_mut",
  [ZirInstTag.AllocInferred]: "alloc_inferred",
  [ZirInstTag.AllocInferredMut]: "alloc_inferred_mut",
  [ZirInstTag.AllocInferredComptime]: "alloc_inferred_comptime",
  [ZirInstTag.AllocInferredComptimeMut]: "alloc_inferred_comptime_mut",
  [ZirInstTag.ResolveInferredAlloc]: "resolve_inferred_alloc",
  [ZirInstTag.MakePtrConst]: "make_ptr_const",
  [ZirInstTag.Resume]: "resume",
  [ZirInstTag.Await]: "await",
  [ZirInstTag.Defer]: "defer",
  [ZirInstTag.DeferErrCode]: "defer_err_code",
  [ZirInstTag.SaveErrRetIndex]: "save_err_ret_index",
  [ZirInstTag.RestoreErrRetIndexUnconditional]:
    "restore_err_ret_index_unconditional",
  [ZirInstTag.RestoreErrRetIndexFnEntry]: "restore_err_ret_index_fn_entry",
  [ZirInstTag.Extended]: "extended",
};

export type Diagnostic = {
  code: string;
  pos: number;
  len: number;
  token: number;
  node: null | number;
  message: string;
};

export type AstNodeArrayTypeSentinel = {
  sentinel: number;
  elem_type: number;
};
export type AstNodeAsm = {
  items_start: number;
  items_end: number;
  rparen: number;
};
export type AstNodeContainerField = {
  align_expr: number;
  value_expr: number;
};
export type AstNodeFnProto = {
  params_start: number;
  params_end: number;
  align_expr: number;
  addrspace_expr: number;
  section_expr: number;
  callconv_expr: number;
};
export type AstNodeFnProtoOne = {
  param: number;
  align_expr: number;
  addrspace_expr: number;
  section_expr: number;
  callconv_expr: number;
};
export type AstNodeGlobalVarDecl = {
  type_node: number;
  align_node: number;
  addrspace_node: number;
  section_node: number;
};
export type AstNodeIf = {
  then_expr: number;
  else_expr: number;
};
export type AstNodeLocalVarDecl = {
  type_node: number;
  align_node: number;
};
export type AstNodePtrType = {
  sentinel: number;
  align_node: number;
  addrspace_node: number;
};
export type AstNodePtrTypeBitRange = {
  sentinel: number;
  align_node: number;
  addrspace_node: number;
  bit_range_start: number;
  bit_range_end: number;
};
export type AstNodeSlice = {
  start: number;
  end: number;
};
export type AstNodeSliceSentinel = {
  start: number;
  end: number;
  sentinel: number;
};
export type AstNodeSubRange = {
  start: number;
  end: number;
};
export type AstNodeWhile = {
  cont_expr: number;
  then_expr: number;
  else_expr: number;
};
export type AstNodeWhileCont = {
  cont_expr: number;
  then_expr: number;
};

export enum TypePointerSize {
  One = 0,
  Many = 1,
  Slice = 2,
  C = 3,
}
export const TypePointerSizeMap: Record<TypePointerSize, string> = {
  [TypePointerSize.One]: "One",
  [TypePointerSize.Many]: "Many",
  [TypePointerSize.Slice]: "Slice",
  [TypePointerSize.C]: "C",
};
export type AstfullArrayInit = {
  ast: {
    lbrace: number;
    elements: Array<number>;
    type_expr: number;
  };
};
export type AstfullArrayType = {
  ast: {
    lbracket: number;
    elem_count: number;
    sentinel: number;
    elem_type: number;
  };
};
export type AstfullAsm = {
  ast: {
    asm_token: number;
    template: number;
    items: Array<number>;
    rparen: number;
  };
  volatile_token: null | number;
  first_clobber: null | number;
  outputs: Array<number>;
  inputs: Array<number>;
};
export type AstfullCall = {
  ast: {
    lparen: number;
    fn_expr: number;
    params: Array<number>;
  };
  async_token: null | number;
};
export type AstfullContainerDecl = {
  layout_token: null | number;
  ast: {
    main_token: number;
    enum_token: null | number;
    members: Array<number>;
    arg: number;
  };
};
export type AstfullContainerField = {
  comptime_token: null | number;
  ast: {
    main_token: number;
    type_expr: number;
    align_expr: number;
    value_expr: number;
    tuple_like: boolean;
  };
};
export type AstfullFnProto = {
  visib_token: null | number;
  extern_export_inline_token: null | number;
  lib_name: null | number;
  name_token: null | number;
  lparen: number;
  ast: {
    proto_node: number;
    fn_token: number;
    return_type: number;
    params: Array<number>;
    align_expr: number;
    addrspace_expr: number;
    section_expr: number;
    callconv_expr: number;
  };
};
export type AstfullFor = {
  ast: {
    for_token: number;
    inputs: Array<number>;
    then_expr: number;
    else_expr: number;
  };
  inline_token: null | number;
  label_token: null | number;
  payload_token: number;
  else_token: number;
};
export type AstfullIf = {
  payload_token: null | number;
  error_token: null | number;
  else_token: number;
  ast: {
    if_token: number;
    cond_expr: number;
    then_expr: number;
    else_expr: number;
  };
};
export type AstfullPtrType = {
  size: TypePointerSize;
  allowzero_token: null | number;
  const_token: null | number;
  volatile_token: null | number;
  ast: {
    main_token: number;
    align_node: number;
    addrspace_node: number;
    sentinel: number;
    bit_range_start: number;
    bit_range_end: number;
    child_type: number;
  };
};
export type AstfullSlice = {
  ast: {
    sliced: number;
    lbracket: number;
    start: number;
    end: number;
    sentinel: number;
  };
};
export type AstfullStructInit = {
  ast: {
    lbrace: number;
    fields: Array<number>;
    type_expr: number;
  };
};
export type AstfullSwitchCase = {
  inline_token: null | number;
  payload_token: null | number;
  ast: {
    values: Array<number>;
    arrow_token: number;
    target_expr: number;
  };
};
export type AstfullVarDecl = {
  visib_token: null | number;
  extern_export_token: null | number;
  lib_name: null | number;
  threadlocal_token: null | number;
  comptime_token: null | number;
  ast: {
    mut_token: number;
    type_node: number;
    align_node: number;
    addrspace_node: number;
    section_node: number;
    init_node: number;
  };
};
export type AstfullWhile = {
  ast: {
    while_token: number;
    cond_expr: number;
    cont_expr: number;
    then_expr: number;
    else_expr: number;
  };
  inline_token: null | number;
  label_token: null | number;
  payload_token: null | number;
  error_token: null | number;
  else_token: number;
};
export type AstfullAssignDestructure = {
  comptime_token: null | number;
  ast: {
    variables: Array<number>;
    equal_token: number;
    value_expr: number;
  };
};

export type Exports = {
  wasmAlloc: (arg_0: number) => number;
  wasmAllocZ: (arg_0: number) => number;
  wasmFree: (arg_0: number, arg_1: number) => void;
  wasmFreeU8Z: (arg_0: number, arg_1: number) => void;
  wasmFreeU32Z: (arg_0: number, arg_1: number) => void;
  destroyAst: (arg_0: number) => void;
  parseAstFromSource: (arg_0: number, arg_1: number) => number;
  getNodesLength: (arg_0: number) => number;
  getTokensLength: (arg_0: number) => number;
  getTokenTag: (arg_0: number, arg_1: number) => number;
  getTokenStart: (arg_0: number, arg_1: number) => number;
  getMainToken: (arg_0: number, arg_1: number) => number;
  getNodeData: (arg_0: number, arg_1: number) => number;
  getExtraDataSpan: (arg_0: number, arg_1: number, arg_2: number) => number;
  getNodeExtraDataArrayTypeSentinel: (arg_0: number, arg_1: number) => number;
  getNodeExtraDataAsm: (arg_0: number, arg_1: number) => number;
  getNodeExtraDataContainerField: (arg_0: number, arg_1: number) => number;
  getNodeExtraDataFnProto: (arg_0: number, arg_1: number) => number;
  getNodeExtraDataFnProtoOne: (arg_0: number, arg_1: number) => number;
  getNodeExtraDataGlobalVarDecl: (arg_0: number, arg_1: number) => number;
  getNodeExtraDataIf: (arg_0: number, arg_1: number) => number;
  getNodeExtraDataLocalVarDecl: (arg_0: number, arg_1: number) => number;
  getNodeExtraDataPtrType: (arg_0: number, arg_1: number) => number;
  getNodeExtraDataPtrTypeBitRange: (arg_0: number, arg_1: number) => number;
  getNodeExtraDataSlice: (arg_0: number, arg_1: number) => number;
  getNodeExtraDataSliceSentinel: (arg_0: number, arg_1: number) => number;
  getNodeExtraDataSubRange: (arg_0: number, arg_1: number) => number;
  getNodeExtraDataWhile: (arg_0: number, arg_1: number) => number;
  getNodeExtraDataWhileCont: (arg_0: number, arg_1: number) => number;
  getNodeTag: (arg_0: number, arg_1: number) => number;
  ifFull: (arg_0: number, arg_1: number) => number;
  asmFull: (arg_0: number, arg_1: number) => number;
  whileFull: (arg_0: number, arg_1: number) => number;
  forFull: (arg_0: number, arg_1: number) => number;
  callFull: (arg_0: number, arg_1: number) => number;
  fullVarDecl: (arg_0: number, arg_1: number) => number;
  fullIf: (arg_0: number, arg_1: number) => number;
  fullWhile: (arg_0: number, arg_1: number) => number;
  fullFor: (arg_0: number, arg_1: number) => number;
  fullContainerField: (arg_0: number, arg_1: number) => number;
  fullFnProto: (arg_0: number, arg_1: number) => number;
  fullStructInit: (arg_0: number, arg_1: number) => number;
  fullArrayInit: (arg_0: number, arg_1: number) => number;
  fullArrayType: (arg_0: number, arg_1: number) => number;
  fullPtrType: (arg_0: number, arg_1: number) => number;
  fullSlice: (arg_0: number, arg_1: number) => number;
  fullContainerDecl: (arg_0: number, arg_1: number) => number;
  fullSwitchCase: (arg_0: number, arg_1: number) => number;
  fullAsm: (arg_0: number, arg_1: number) => number;
  assignDestructure: (arg_0: number, arg_1: number) => number;
  globalVarDecl: (arg_0: number, arg_1: number) => number;
  localVarDecl: (arg_0: number, arg_1: number) => number;
  simpleVarDecl: (arg_0: number, arg_1: number) => number;
  alignedVarDecl: (arg_0: number, arg_1: number) => number;
  fullCall: (arg_0: number, arg_1: number) => number;
  containerDeclRoot: (arg_0: number) => number;
  getNodeSource: (arg_0: number, arg_1: number) => number;
  tokenSlice: (arg_0: number, arg_1: number) => number;
  tokenLocation: (arg_0: number, arg_1: number, arg_2: number) => number;
  getFirstToken: (arg_0: number, arg_1: number) => number;
  getLastToken: (arg_0: number, arg_1: number) => number;
  getTokenRange: (arg_0: number, arg_1: number) => number;
  getNodeRange: (arg_0: number, arg_1: number) => number;
  nodeToSpan: (arg_0: number, arg_1: number) => number;
  tokenizeLine: (arg_0: number, arg_1: number) => number;
  render: (arg_0: number) => number;
  debugZir: (arg_0: number) => void;
  generateZir: (arg_0: number) => number;
  destroyZir: (arg_0: number) => void;
  getZirInstructionsLength: (arg_0: number) => number;
  getZirInstructionTag: (arg_0: number, arg_1: number) => number;
  renderZir: (arg_0: number, arg_1: number) => number;
  getAstErrors: (arg_0: number) => number;
  getZirErrors: (arg_0: number, arg_1: number) => number;
};
