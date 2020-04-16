"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const ErrorDeal_1 = require("./ErrorDeal");
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["LEX_WARNING"] = 0] = "LEX_WARNING";
    ErrorType[ErrorType["LEX_ERROR"] = 1] = "LEX_ERROR";
    ErrorType[ErrorType["PARSE_WARNING"] = 2] = "PARSE_WARNING";
    ErrorType[ErrorType["PARSE_ERROR"] = 3] = "PARSE_ERROR";
    ErrorType[ErrorType["PARSE_RECOMMEND"] = 4] = "PARSE_RECOMMEND";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
/**
 * 错误类
 * ErrorType 错误类型
 * ErrorMessage：错误信息
 */
class Error {
    constructor(errorType, errorMessage) {
        this.errorType = errorType;
        this.errorMessage = errorMessage;
    }
    ;
}
exports.Error = Error;
/**
 * 错误列表
 * errorCode是错误的编号
 *
 */
class ErrorList {
    constructor() {
        this.errorMap = {};
        this.errorMap["PW1"] = new Error(ErrorType.PARSE_WARNING, "数组使用前必须使用reserve语句进行内存空间的分配"); //已完成
        this.errorMap["PW2"] = new Error(ErrorType.PARSE_WARNING, "定义引用实体前必须先创建实体对象"); //已完成
        this.errorMap["PW3"] = new Error(ErrorType.PARSE_WARNING, "禁止条件判别条件成立时分支无执行语句"); //已完成
        this.errorMap["PW4"] = new Error(ErrorType.PARSE_WARNING, "在select语句中必须有default语句"); // 已完成
        this.errorMap["PW5"] = new Error(ErrorType.PARSE_WARNING, "禁止使用goto语句"); // 已完成
        this.errorMap["PW6"] = new Error(ErrorType.PARSE_WARNING, "禁止重新定义关键字");
        this.errorMap["PW7"] = new Error(ErrorType.PARSE_WARNING, "数组下标必须是整数"); //已完成
        this.errorMap["PW8"] = new Error(ErrorType.PARSE_WARNING, "有返回值的函数中return必须带有返回值"); //已完成
        this.errorMap["PW9"] = new Error(ErrorType.PARSE_WARNING, "if或者while后面的判断语句必须用小括号括起来"); //已完成
        this.errorMap["PW10"] = new Error(ErrorType.PARSE_WARNING, "禁止将标签定义为关键字和基本类型"); //已完成
        this.errorMap["PW11"] = new Error(ErrorType.PARSE_WARNING, "禁止全局变量与局部变量同名"); //已完成
        this.errorMap["PW12"] = new Error(ErrorType.PARSE_WARNING, "禁止方法参数个数和顺序必须与定义的个数和顺序不相同");
        this.errorMap["PW13"] = new Error(ErrorType.PARSE_WARNING, "当指针所指对象被毁灭(destroy)后必须置为0");
        this.errorMap["PW14"] = new Error(ErrorType.PARSE_WARNING, "禁止函数为空");
        this.errorMap["PW15"] = new Error(ErrorType.PARSE_WARNING, "禁止给变量赋的值与变量的类型不一致");
        this.errorMap["PW16"] = new Error(ErrorType.PARSE_WARNING, "禁止将越界整数赋值给整型变量");
        this.errorMap["PW17"] = new Error(ErrorType.PARSE_WARNING, "禁止使用其他类型变量给指针变量赋值");
        this.errorMap["PW18"] = new Error(ErrorType.PARSE_WARNING, "禁止process，event，routine，function的返回值声明类型和实际调用类型不一致");
        this.errorMap["PW19"] = new Error(ErrorType.PARSE_WARNING, "禁止对实数类型的量做是否相等的比较");
        this.errorMap["PW20"] = new Error(ErrorType.PARSE_WARNING, "禁止对指针变量进行大小判断");
        this.errorMap["PW21"] = new Error(ErrorType.PARSE_WARNING, "禁止使用实体名作为实体指针");
        this.errorMap["PW22"] = new Error(ErrorType.PARSE_WARNING, "禁止在内部块中重新定义已有的变量名");
        this.errorMap["PW23"] = new Error(ErrorType.PARSE_WARNING, "禁止局部变量名和函数名同名");
        this.errorMap["PW24"] = new Error(ErrorType.PARSE_WARNING, "禁止单独使用小写字母“l”或大写字母“O”作为变量名");
        this.errorMap["PW25"] = new Error(ErrorType.PARSE_WARNING, "禁止更改time.v的值");
        this.errorMap["PW26"] = new Error(ErrorType.PARSE_WARNING, "在执行事件函数时必须加上start simulation");
        this.errorMap["PR1"] = new Error(ErrorType.PARSE_RECOMMEND, "建议在for或者while循环条件后，使用',do'"); //已完成
        this.errorMap["PR2"] = new Error(ErrorType.PARSE_RECOMMEND, "建议使用define to mean定义常数"); // 已完成
        this.errorMap["PR3"] = new Error(ErrorType.PARSE_RECOMMEND, "print语句下面的格式行一般不应缩进"); // 已完成
        this.errorMap["PR4"] = new Error(ErrorType.PARSE_RECOMMEND, "建议谨慎修改数组起始下标");
        this.errorMap["PR5"] = new Error(ErrorType.PARSE_RECOMMEND, "避免使用cycle语句"); // 已完成
        this.errorMap["PR6"] = new Error(ErrorType.PARSE_RECOMMEND, "建议文件及语法结构长度不宜过长");
        this.errorMap["PR7"] = new Error(ErrorType.PARSE_RECOMMEND, "函数中避免使用过多的参数，建议不要超过10个"); //已完成
        this.errorMap["PR8"] = new Error(ErrorType.PARSE_RECOMMEND, "建议不使用for each"); //已完成
        this.errorMap["PR9"] = new Error(ErrorType.PARSE_RECOMMEND, "建议逻辑表达式尽量少使用is false"); //已完成
        this.errorMap["PR10"] = new Error(ErrorType.PARSE_RECOMMEND, "使用标签跳转，读取最大的下标值建议不超过3000");
        this.errorMap["PR11"] = new Error(ErrorType.PARSE_RECOMMEND, "建议给变量赋的值和变量类型要一致");
        this.errorMap["PR12"] = new Error(ErrorType.PARSE_RECOMMEND, "谨慎做整型量除以整型量的计算");
        this.errorMap["PR13"] = new Error(ErrorType.PARSE_RECOMMEND, "谨慎使用不同类型的混合运算");
        this.errorMap["PR14"] = new Error(ErrorType.PARSE_RECOMMEND, "建议避免函数仅含有返回语句");
        this.errorMap["PR15"] = new Error(ErrorType.PARSE_RECOMMEND, "谨慎在循环体内部修改循环控制变量");
        this.errorMap["PR16"] = new Error(ErrorType.PARSE_RECOMMEND, "建议使用带类型前缀的变量明名");
        this.errorMap["PR17"] = new Error(ErrorType.PARSE_RECOMMEND, "定义事件函数执行的优先级");
        this.errorMap["PR18"] = new Error(ErrorType.PARSE_RECOMMEND, "尽量不要在事件函数外修改其所需的变量");
        this.errorMap["PR19"] = new Error(ErrorType.PARSE_RECOMMEND, "谨慎使用对象已经被毁灭的指针");
    }
    ;
}
exports.ErrorList = ErrorList;
/**
 * *语法
 * KW开头表明是关键词
 */
var Tag;
(function (Tag) {
    Tag[Tag["PARSE_INIT"] = 0] = "PARSE_INIT";
    Tag[Tag["ERR"] = 1] = "ERR";
    Tag[Tag["ID"] = 2] = "ID";
    Tag[Tag["KW_INT"] = 3] = "KW_INT";
    Tag[Tag["KW_TEXT"] = 4] = "KW_TEXT";
    Tag[Tag["KW_DOUBLE"] = 5] = "KW_DOUBLE";
    Tag[Tag["KW_REAL"] = 6] = "KW_REAL";
    Tag[Tag["KW_CONSTANT"] = 7] = "KW_CONSTANT";
    Tag[Tag["KW_POINTER"] = 8] = "KW_POINTER";
    Tag[Tag["NUM"] = 9] = "NUM";
    Tag[Tag["str"] = 10] = "str";
    Tag[Tag["ADD"] = 11] = "ADD";
    Tag[Tag["SUB"] = 12] = "SUB";
    Tag[Tag["MUL"] = 13] = "MUL";
    Tag[Tag["DIV"] = 14] = "DIV";
    Tag[Tag["GT"] = 15] = "GT";
    Tag[Tag["GE"] = 16] = "GE";
    Tag[Tag["LT"] = 17] = "LT";
    Tag[Tag["LE"] = 18] = "LE";
    Tag[Tag["EQU"] = 19] = "EQU";
    Tag[Tag["NEQU"] = 20] = "NEQU";
    Tag[Tag["LPAREN"] = 21] = "LPAREN";
    Tag[Tag["RPAREN"] = 22] = "RPAREN";
    Tag[Tag["LBRACK"] = 23] = "LBRACK";
    Tag[Tag["RBRACK"] = 24] = "RBRACK";
    Tag[Tag["LBARCE"] = 25] = "LBARCE";
    Tag[Tag["RBRACE"] = 26] = "RBRACE";
    Tag[Tag["COMMA"] = 27] = "COMMA";
    Tag[Tag["COLON"] = 28] = "COLON";
    Tag[Tag["ASSIGN"] = 29] = "ASSIGN";
    Tag[Tag["KW_DO"] = 30] = "KW_DO";
    Tag[Tag["KW_WHILE"] = 31] = "KW_WHILE";
    Tag[Tag["KW_END"] = 32] = "KW_END";
    Tag[Tag["KW_FOR"] = 33] = "KW_FOR";
    Tag[Tag["KW_SWITCH"] = 34] = "KW_SWITCH";
    Tag[Tag["KW_LEAVE"] = 35] = "KW_LEAVE";
    Tag[Tag["KW_ALWAYS"] = 36] = "KW_ALWAYS";
    Tag[Tag["KW_EACH"] = 37] = "KW_EACH";
    Tag[Tag["KW_LOOP"] = 38] = "KW_LOOP";
    Tag[Tag["KW_CYCLE"] = 39] = "KW_CYCLE";
    Tag[Tag["KW_WITH"] = 40] = "KW_WITH";
    Tag[Tag["KW_IF"] = 41] = "KW_IF";
    Tag[Tag["KW_ELSE"] = 42] = "KW_ELSE";
    Tag[Tag["KW_FILE"] = 43] = "KW_FILE";
    Tag[Tag["KW_REMOVE"] = 44] = "KW_REMOVE";
    Tag[Tag["KW_ENTITY"] = 45] = "KW_ENTITY";
    Tag[Tag["KW_EVERY"] = 46] = "KW_EVERY";
    Tag[Tag["KW_HAVE"] = 47] = "KW_HAVE";
    Tag[Tag["KW_OWNS"] = 48] = "KW_OWNS";
    Tag[Tag["KW_BELONG"] = 49] = "KW_BELONG";
    Tag[Tag["KW_SET"] = 50] = "KW_SET";
    Tag[Tag["KW_FROM"] = 51] = "KW_FROM";
    Tag[Tag["KW_FIFO"] = 52] = "KW_FIFO";
    Tag[Tag["KW_LIFO"] = 53] = "KW_LIFO";
    Tag[Tag["KW_SELECT"] = 54] = "KW_SELECT";
    Tag[Tag["KW_ENDSELECT"] = 55] = "KW_ENDSELECT";
    Tag[Tag["KW_CASE"] = 56] = "KW_CASE";
    Tag[Tag["KW_DEFAULT"] = 57] = "KW_DEFAULT";
    Tag[Tag["KW_RETUEN"] = 58] = "KW_RETUEN";
    Tag[Tag["KW_PREAMBLE"] = 59] = "KW_PREAMBLE";
    Tag[Tag["KW_INCLUDING"] = 60] = "KW_INCLUDING";
    Tag[Tag["KW_SYSTEM"] = 61] = "KW_SYSTEM";
    Tag[Tag["KW_SUBSYSTEM"] = 62] = "KW_SUBSYSTEM";
    Tag[Tag["KW_MAIN"] = 63] = "KW_MAIN";
    Tag[Tag["KW_ROUTINE"] = 64] = "KW_ROUTINE";
    Tag[Tag["KW_FUNCTION"] = 65] = "KW_FUNCTION";
    Tag[Tag["KW_PROCESS"] = 66] = "KW_PROCESS";
    Tag[Tag["KW_EVENT"] = 67] = "KW_EVENT";
    Tag[Tag["KW_GIVEN"] = 68] = "KW_GIVEN";
    Tag[Tag["KW_YIELDING"] = 69] = "KW_YIELDING";
    Tag[Tag["KW_DEFINE"] = 70] = "KW_DEFINE";
    Tag[Tag["KW_ARTICLE"] = 71] = "KW_ARTICLE";
    Tag[Tag["KW_THIS"] = 72] = "KW_THIS";
    Tag[Tag["KW_AS"] = 73] = "KW_AS";
    Tag[Tag["KW_VARIABLE"] = 74] = "KW_VARIABLE";
    Tag[Tag["KW_REFERENCE"] = 75] = "KW_REFERENCE";
    Tag[Tag["KW_ARGUMENT"] = 76] = "KW_ARGUMENT";
    Tag[Tag["KW_DIMENSION"] = 77] = "KW_DIMENSION";
    Tag[Tag["KW_NORMALLY"] = 78] = "KW_NORMALLY";
    Tag[Tag["KW_MODE"] = 79] = "KW_MODE";
    Tag[Tag["KW_NOT"] = 80] = "KW_NOT";
    Tag[Tag["KW_IS"] = 81] = "KW_IS";
    Tag[Tag["KW_TEMPORARY"] = 82] = "KW_TEMPORARY";
    Tag[Tag["KW_PERMANENT"] = 83] = "KW_PERMANENT";
    Tag[Tag["KW_CALL"] = 84] = "KW_CALL";
    Tag[Tag["KW_CREATE"] = 85] = "KW_CREATE";
    Tag[Tag["KW_CALLED"] = 86] = "KW_CALLED";
    Tag[Tag["KW_ACTIVITY"] = 87] = "KW_ACTIVITY";
    Tag[Tag["KW_SCHEDULE"] = 88] = "KW_SCHEDULE";
    Tag[Tag["KW_WAIT"] = 89] = "KW_WAIT";
    Tag[Tag["KW_WORK"] = 90] = "KW_WORK";
    Tag[Tag["KW_UNIT"] = 91] = "KW_UNIT";
    Tag[Tag["KW_IN"] = 92] = "KW_IN";
    Tag[Tag["KW_AT"] = 93] = "KW_AT";
    Tag[Tag["KW_START"] = 94] = "KW_START";
    Tag[Tag["KW_SIMULATON"] = 95] = "KW_SIMULATON";
    Tag[Tag["KW_READ"] = 96] = "KW_READ";
    Tag[Tag["KW_WRITE"] = 97] = "KW_WRITE";
    Tag[Tag["KW_PRINT"] = 98] = "KW_PRINT";
    Tag[Tag["KW_LINE"] = 99] = "KW_LINE";
    Tag[Tag["KW_LET"] = 100] = "KW_LET";
    Tag[Tag["KW_RESERVE"] = 101] = "KW_RESERVE";
    Tag[Tag["KW_OPEN"] = 102] = "KW_OPEN";
    Tag[Tag["KW_INPUT"] = 103] = "KW_INPUT";
    Tag[Tag["KW_OUTPUT"] = 104] = "KW_OUTPUT";
    Tag[Tag["KW_NAME"] = 105] = "KW_NAME";
    Tag[Tag["KW_USE"] = 106] = "KW_USE";
    Tag[Tag["KW_THUS"] = 107] = "KW_THUS";
    Tag[Tag["KW_EMPTY"] = 108] = "KW_EMPTY";
    Tag[Tag["KW_MEAN"] = 109] = "KW_MEAN";
    Tag[Tag["KW_ALPHA"] = 110] = "KW_ALPHA";
    Tag[Tag["KW_GO"] = 111] = "KW_GO";
    Tag[Tag["KW_SIGNED_INTEGER"] = 112] = "KW_SIGNED_INTEGER";
    Tag[Tag["KW_DUMMY"] = 113] = "KW_DUMMY";
    Tag[Tag["KW_SUBPROGRAM"] = 114] = "KW_SUBPROGRAM";
    Tag[Tag["KW_STREAM"] = 115] = "KW_STREAM";
    Tag[Tag["KW_ARRAY"] = 116] = "KW_ARRAY";
    Tag[Tag["KW_ALL"] = 117] = "KW_ALL";
    Tag[Tag["KW_DESTORY"] = 118] = "KW_DESTORY";
    Tag[Tag["KW_SUBROUTINE"] = 119] = "KW_SUBROUTINE";
    Tag[Tag["KW_THEN"] = 120] = "KW_THEN";
    Tag[Tag["KW_OTHERWISE"] = 121] = "KW_OTHERWISE";
    Tag[Tag["KW_ENDIF"] = 122] = "KW_ENDIF";
    Tag[Tag["KW_REGARDLESS"] = 123] = "KW_REGARDLESS";
    Tag[Tag["KW_NEXTLINE"] = 124] = "KW_NEXTLINE";
    Tag[Tag["KW_TO"] = 125] = "KW_TO";
    Tag[Tag["KW_BELONGS"] = 126] = "KW_BELONGS";
    Tag[Tag["LABEL"] = 127] = "LABEL"; //标签
})(Tag = exports.Tag || (exports.Tag = {}));
class myKeyWords {
    constructor() {
        this.keyword = {};
        this.keyword['integer'] = Tag.KW_INT;
        this.keyword['text'] = Tag.KW_TEXT;
        this.keyword['double'] = Tag.KW_DOUBLE;
        this.keyword['real'] = Tag.KW_REAL;
        this.keyword['constant'] = Tag.KW_CONSTANT;
        this.keyword['constants'] = Tag.KW_CONSTANT;
        this.keyword['pointer'] = Tag.KW_POINTER;
        this.keyword['if'] = Tag.KW_IF;
        this.keyword['else'] = Tag.KW_ELSE;
        this.keyword['otherwise'] = Tag.KW_ELSE;
        this.keyword['always'] = Tag.KW_ALWAYS;
        this.keyword['while'] = Tag.KW_WHILE;
        this.keyword['for'] = Tag.KW_FOR;
        this.keyword['each'] = Tag.KW_EACH;
        this.keyword['do'] = Tag.KW_DO;
        this.keyword['loop'] = Tag.KW_LOOP;
        this.keyword['leave'] = Tag.KW_LEAVE;
        this.keyword['cycle'] = Tag.KW_CYCLE;
        this.keyword['select'] = Tag.KW_SELECT;
        this.keyword['end'] = Tag.KW_END;
        this.keyword['endselect'] = Tag.KW_ENDSELECT;
        this.keyword['case'] = Tag.KW_CASE;
        this.keyword['default'] = Tag.KW_DEFAULT;
        this.keyword['with'] = Tag.KW_WITH;
        this.keyword['preamble'] = Tag.KW_PREAMBLE;
        this.keyword['including'] = Tag.KW_INCLUDING;
        this.keyword['system'] = Tag.KW_SYSTEM;
        this.keyword['main'] = Tag.KW_MAIN;
        this.keyword['routine'] = Tag.KW_ROUTINE;
        this.keyword['function'] = Tag.KW_FUNCTION;
        this.keyword['return'] = Tag.KW_RETUEN;
        this.keyword['process'] = Tag.KW_PROCESS;
        this.keyword['processes'] = Tag.KW_PROCESS;
        this.keyword['event'] = Tag.KW_EVENT;
        this.keyword['events'] = Tag.KW_EVENT;
        this.keyword['given'] = Tag.KW_GIVEN;
        this.keyword['yielding'] = Tag.KW_YIELDING;
        this.keyword['define'] = Tag.KW_DEFINE;
        this.keyword['a'] = Tag.KW_ARTICLE;
        this.keyword['an'] = Tag.KW_ARTICLE;
        this.keyword['the'] = Tag.KW_ARTICLE;
        this.keyword['this'] = Tag.KW_THIS;
        this.keyword['as'] = Tag.KW_AS;
        this.keyword['variable'] = Tag.KW_VARIABLE;
        this.keyword['variables'] = Tag.KW_VARIABLE;
        this.keyword['reference'] = Tag.KW_REFERENCE;
        this.keyword['argument'] = Tag.KW_ARGUMENT;
        this.keyword['arguments'] = Tag.KW_ARGUMENT;
        this.keyword['dimension'] = Tag.KW_DIMENSION;
        this.keyword['dim'] = Tag.KW_DIMENSION;
        this.keyword['normally'] = Tag.KW_NORMALLY;
        this.keyword['mode'] = Tag.KW_MODE;
        this.keyword['not'] = Tag.KW_NOT;
        this.keyword['is'] = Tag.KW_IS;
        this.keyword['temporary'] = Tag.KW_TEMPORARY;
        this.keyword['permanent'] = Tag.KW_PERMANENT;
        this.keyword['entity'] = Tag.KW_ENTITY;
        this.keyword['entities'] = Tag.KW_ENTITY;
        this.keyword['every'] = Tag.KW_EVERY;
        this.keyword['has'] = Tag.KW_HAVE;
        this.keyword['have'] = Tag.KW_HAVE;
        this.keyword['owns'] = Tag.KW_OWNS;
        this.keyword['to'] = Tag.KW_TO;
        this.keyword['set'] = Tag.KW_SET;
        this.keyword['file'] = Tag.KW_FILE;
        this.keyword['remove'] = Tag.KW_REMOVE;
        this.keyword['from'] = Tag.KW_FROM;
        this.keyword['fifo'] = Tag.KW_FIFO;
        this.keyword['lifo'] = Tag.KW_LIFO;
        this.keyword['call'] = Tag.KW_CALL;
        this.keyword['create'] = Tag.KW_CREATE;
        this.keyword['called'] = Tag.KW_CALLED;
        this.keyword['activity'] = Tag.KW_ACTIVITY;
        this.keyword['schedule'] = Tag.KW_SCHEDULE;
        this.keyword['wait'] = Tag.KW_WAIT;
        this.keyword['work'] = Tag.KW_WORK;
        this.keyword['unit'] = Tag.KW_UNIT;
        this.keyword['units'] = Tag.KW_UNIT;
        this.keyword['in'] = Tag.KW_IN;
        this.keyword['at'] = Tag.KW_AT;
        this.keyword['start'] = Tag.KW_START;
        this.keyword['simulation'] = Tag.KW_SIMULATON;
        this.keyword['read'] = Tag.KW_READ;
        this.keyword['write'] = Tag.KW_WRITE;
        this.keyword['print'] = Tag.KW_PRINT;
        this.keyword['line'] = Tag.KW_LINE;
        this.keyword['thus'] = Tag.KW_THUS;
        this.keyword['let'] = Tag.KW_LET;
        this.keyword['reserve'] = Tag.KW_RESERVE;
        this.keyword['open'] = Tag.KW_OPEN;
        this.keyword['input'] = Tag.KW_INPUT;
        this.keyword['output'] = Tag.KW_OUTPUT;
        this.keyword['name'] = Tag.KW_NAME;
        this.keyword['use'] = Tag.KW_USE;
        this.keyword['eq'] = Tag.EQU;
        this.keyword['ne'] = Tag.NEQU;
        this.keyword['ls'] = Tag.LT;
        this.keyword['lt'] = Tag.LT;
        this.keyword['gr'] = Tag.GT;
        this.keyword['gt'] = Tag.GT;
        this.keyword['le'] = Tag.LE;
        this.keyword['ge'] = Tag.GE;
        this.keyword['empty'] = Tag.KW_EMPTY;
        this.keyword['mean'] = Tag.KW_MEAN;
        this.keyword['alpha'] = Tag.KW_ALPHA;
        this.keyword['regardless'] = Tag.KW_ALWAYS;
        this.keyword['endif'] = Tag.KW_ALWAYS;
        this.keyword['go'] = Tag.KW_GO;
        this.keyword['dummy'] = Tag.KW_DUMMY;
        this.keyword['subprogram'] = Tag.KW_SUBPROGRAM;
        this.keyword['stream'] = Tag.KW_STREAM;
        this.keyword['array'] = Tag.KW_ARRAY;
        this.keyword['all'] = Tag.KW_ALL;
        this.keyword['destory'] = Tag.KW_DESTORY;
        this.keyword["subroutine"] = Tag.KW_SUBROUTINE;
        this.keyword['then'] = Tag.KW_THEN;
        this.keyword['otherwise'] = Tag.KW_OTHERWISE;
        this.keyword['endif'] = Tag.KW_ENDIF;
        this.keyword['regardless'] = Tag.KW_REGARDLESS;
    }
    ;
    /**
     * getTag
     * 获取对应的Tag（判断是不是关键词）
     */
    getTag(name) {
        if (this.keyword[name] != null) {
            return this.keyword[name];
        }
        else {
            return Tag.ID;
        }
    }
}
/**
 * Token 类
 * Token type 包括 保留关键字(keyword)，标识符(ID)，数字(Num)，字符串(str)，不过这部分放到Tag里好了
 * myTokenVal 主要是token值,针对关键词是null，标识符和字符串string，数字number
 * myTag是对应的语法标记
 * myTokenOffset start和end主要是报错了在文件中的位置，方便后续标错
 */
class myToken {
    constructor(myTokenVal, myTokenOffsetStart, myTokenOffsetEnd, myTag) {
        this.myTokenVal = myTokenVal;
        this.myTokenOffsetStart = myTokenOffsetStart;
        this.myTokenOffsetEnd = myTokenOffsetEnd;
        this.myTag = myTag;
    }
    ;
    /**
     * toString
     */
    toString() {
        let tempString = "";
        tempString += this.myTokenVal + "|" + this.myTokenOffsetStart + "|" + this.myTokenOffsetEnd + "|" + this.myTag;
        return tempString;
    }
}
exports.myToken = myToken;
class myDocument {
    constructor(myTextDocument) {
        this.myTextDocument = myTextDocument;
        this.myDocumentOffset = 0;
    }
    ;
    /**
     * getChar，获取一个字符,offset+1;
     * 超过边界的时候返回""
     */
    getChar() {
        let myDocumentPositionStart = this.myTextDocument.positionAt(this.myDocumentOffset);
        let myDocumentPositionEnd = this.myTextDocument.positionAt(this.myDocumentOffset + 1);
        // range好像是左闭右开的
        let myDocumentRange = {
            start: myDocumentPositionStart,
            end: myDocumentPositionEnd
        };
        this.myDocumentOffset += 1;
        return this.myTextDocument.getText(myDocumentRange);
    }
    /**
     * 回到前一个字符
     */
    preChar() {
        this.myDocumentOffset -= 1;
    }
}
/**
 * 词法分析类
 * myTokens:词法分析结果
 * myKeyword:关键词表
 * myDiagonstics: 诊断列表
 */
class lexer {
    constructor(myLexerTextDocument) {
        this.myLexerTextDocument = myLexerTextDocument;
        this.myTokens = new Array();
        this.myLexDocument = new myDocument(myLexerTextDocument);
        this.myKeywords = new myKeyWords();
        this.myDiagnostics = new Array();
        this.lexErrorList = new ErrorList();
    }
    ;
    /**
     * isDigit
     * 判断一个字符是不是数字
     */
    isDigit(toDoString) {
        let pattern = /\d/g;
        let m = pattern.exec(toDoString);
        if (!!m) {
            return true;
        }
        return false;
    }
    ;
    /**
     * isAlpha
     * 判断一个字符是不是字母
     */
    isAlpha(toDoString) {
        let pattern = /[A-Za-z]/g;
        let m = pattern.exec(toDoString);
        if (!!m) {
            return true;
        }
        return false;
    }
    /**
     * isSymbol
     * 判断一个字符是不是符号
     */
    isSymbol(toDoString) {
        let pattern = /\W/g;
        let m = pattern.exec(toDoString);
        if (!!m && !this.isNoSense(toDoString)) {
            return true;
        }
        return false;
    }
    /**
     * isNoSense
     */
    isNoSense(toDoString) {
        let pattern = /\s/g;
        let m = pattern.exec(toDoString);
        if (!!m) {
            return true;
        }
        return false;
    }
    /**
     * doLexer
     */
    doLexer() {
        let charNow = this.myLexDocument.getChar();
        while (charNow !== "") {
            // 判断关键词和标识符
            if (this.isAlpha(charNow) || charNow === "_") {
                let stringTemp = "";
                let offsetTempBegin = this.myLexDocument.myDocumentOffset;
                do {
                    stringTemp += charNow;
                    charNow = this.myLexDocument.getChar();
                } while (this.isAlpha(charNow) || charNow === "." || charNow === "_" || this.isDigit(charNow));
                stringTemp = stringTemp.toLowerCase();
                if (stringTemp == "to" && this.myTokens[this.myTokens.length - 1].myTokenVal == "go") {
                    let diagnostic = {
                        severity: vscode_languageserver_1.DiagnosticSeverity.Warning,
                        range: {
                            start: this.myLexerTextDocument.positionAt(this.myTokens[this.myTokens.length - 1].myTokenOffsetStart - 1),
                            end: this.myLexerTextDocument.positionAt(this.myLexDocument.myDocumentOffset)
                        },
                        message: this.lexErrorList.errorMap['PW5'].errorMessage
                    };
                    this.myDiagnostics.push(diagnostic);
                }
                else if (stringTemp == "cycle") {
                    let diagnostic = {
                        severity: vscode_languageserver_1.DiagnosticSeverity.Information,
                        range: {
                            start: this.myLexerTextDocument.positionAt(offsetTempBegin - 1),
                            end: this.myLexerTextDocument.positionAt(this.myLexDocument.myDocumentOffset)
                        },
                        message: this.lexErrorList.errorMap["PR5"].errorMessage
                    };
                    this.myDiagnostics.push(diagnostic);
                }
                else if (stringTemp == "false" && this.myTokens[this.myTokens.length - 1].myTokenVal == "is") {
                    let diagnostic = {
                        severity: vscode_languageserver_1.DiagnosticSeverity.Information,
                        range: {
                            start: this.myLexerTextDocument.positionAt(this.myTokens[this.myTokens.length - 1].myTokenOffsetStart - 1),
                            end: this.myLexerTextDocument.positionAt(this.myLexDocument.myDocumentOffset)
                        },
                        message: this.lexErrorList.errorMap["PR9"].errorMessage
                    };
                    this.myDiagnostics.push(diagnostic);
                }
                let tagTemp = this.myKeywords.getTag(stringTemp);
                this.myTokens[this.myTokens.length] = new myToken(stringTemp, offsetTempBegin, this.myLexDocument.myDocumentOffset, tagTemp);
            }
            // 判断数字
            else if (this.isDigit(charNow)) {
                let stringTemp = "";
                let offsetTempBegin = this.myLexDocument.myDocumentOffset;
                do {
                    stringTemp += charNow;
                    charNow = this.myLexDocument.getChar();
                } while (this.isDigit(charNow) || charNow === ".");
                this.myTokens[this.myTokens.length] = new myToken(stringTemp, offsetTempBegin, this.myLexDocument.myDocumentOffset, Tag.NUM);
            }
            //判断符号
            else if (this.isSymbol(charNow)) {
                if (charNow === "'") {
                    charNow = this.myLexDocument.getChar();
                    if (charNow == "'") {
                        do {
                            charNow = this.myLexDocument.getChar();
                        } while (charNow !== "\n" && charNow !== "");
                        charNow = this.myLexDocument.getChar();
                    }
                    // label的情况
                    else {
                        let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                        let myLabel = "";
                        while (charNow != "'") {
                            myLabel += charNow;
                            charNow = this.myLexDocument.getChar();
                        }
                        this.myTokens[this.myTokens.length] = new myToken(myLabel, myTokenOffsetBegin, this.myLexDocument.myDocumentOffset, Tag.LABEL);
                        if (this.myKeywords.getTag(myLabel) != Tag.ID) {
                            let diagnostic = {
                                severity: vscode_languageserver_1.DiagnosticSeverity.Warning,
                                range: {
                                    start: this.myLexerTextDocument.positionAt(myTokenOffsetBegin - 1),
                                    end: this.myLexerTextDocument.positionAt(this.myLexDocument.myDocumentOffset - 1)
                                },
                                message: this.lexErrorList.errorMap["PW10"].errorMessage
                            };
                            this.myDiagnostics.push(diagnostic);
                        }
                        charNow = this.myLexDocument.getChar();
                    }
                }
                else if (charNow === "/") {
                    charNow = this.myLexDocument.getChar();
                    let charPre = charNow;
                    let charPrePre = "";
                    if (charNow === "~") {
                        do {
                            charPrePre = charPre;
                            charPre = charNow;
                            charNow = this.myLexDocument.getChar();
                        } while ((charPrePre === "/" || charNow !== "/" || charPre !== "~") && charNow !== "");
                        charNow = this.myLexDocument.getChar();
                    }
                }
                else if (charNow === "\"") {
                    charNow = this.myLexDocument.getChar();
                    let stringTemp = "";
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    while (charNow !== "" && charNow !== "\"") {
                        stringTemp += charNow;
                        charNow = this.myLexDocument.getChar();
                    }
                    this.myTokens[this.myTokens.length] = new myToken(stringTemp, myTokenOffsetBegin, this.myLexDocument.myDocumentOffset, Tag.str);
                }
                else if (charNow === "=") {
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    charNow = this.myLexDocument.getChar();
                    if (charNow !== "=") {
                        this.myTokens[this.myTokens.length] = new myToken("=", myTokenOffsetBegin, this.myLexDocument.myDocumentOffset, Tag.ASSIGN);
                    }
                    else {
                        this.myTokens[this.myTokens.length] = new myToken("==", myTokenOffsetBegin, this.myLexDocument.myDocumentOffset + 1, Tag.EQU);
                        charNow = this.myLexDocument.getChar();
                    }
                }
                else if (charNow === ">") {
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    charNow = this.myLexDocument.getChar();
                    if (charNow !== "=") {
                        this.myTokens[this.myTokens.length] = new myToken(">", myTokenOffsetBegin, this.myLexDocument.myDocumentOffset, Tag.GT);
                    }
                    else {
                        this.myTokens[this.myTokens.length] = new myToken(">=", myTokenOffsetBegin, this.myLexDocument.myDocumentOffset + 1, Tag.GE);
                        charNow = this.myLexDocument.getChar();
                    }
                }
                else if (charNow === "<") {
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    charNow = this.myLexDocument.getChar();
                    if (charNow === ">") {
                        this.myTokens[this.myTokens.length] = new myToken("<", myTokenOffsetBegin, this.myLexDocument.myDocumentOffset, Tag.NEQU);
                    }
                    else if (charNow !== "=") {
                        this.myTokens[this.myTokens.length] = new myToken("<", myTokenOffsetBegin, this.myLexDocument.myDocumentOffset, Tag.LT);
                    }
                    else {
                        this.myTokens[this.myTokens.length] = new myToken("<=", myTokenOffsetBegin, this.myLexDocument.myDocumentOffset + 1, Tag.LE);
                        charNow = this.myLexDocument.getChar();
                    }
                }
                else if (charNow === "(") {
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    this.myTokens[this.myTokens.length] = new myToken("(", myTokenOffsetBegin, myTokenOffsetBegin + 1, Tag.LPAREN);
                    charNow = this.myLexDocument.getChar();
                }
                else if (charNow === ")") {
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    this.myTokens[this.myTokens.length] = new myToken(")", myTokenOffsetBegin, myTokenOffsetBegin + 1, Tag.RPAREN);
                    charNow = this.myLexDocument.getChar();
                }
                else if (charNow === "[") {
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    this.myTokens[this.myTokens.length] = new myToken("[", myTokenOffsetBegin, myTokenOffsetBegin + 1, Tag.LBRACK);
                    charNow = this.myLexDocument.getChar();
                }
                else if (charNow === "]") {
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    this.myTokens[this.myTokens.length] = new myToken("]", myTokenOffsetBegin, myTokenOffsetBegin + 1, Tag.RBRACK);
                    charNow = this.myLexDocument.getChar();
                }
                else if (charNow === "{") {
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    this.myTokens[this.myTokens.length] = new myToken("{", myTokenOffsetBegin, myTokenOffsetBegin + 1, Tag.LBARCE);
                    charNow = this.myLexDocument.getChar();
                }
                else if (charNow === "}") {
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    this.myTokens[this.myTokens.length] = new myToken("}", myTokenOffsetBegin, myTokenOffsetBegin + 1, Tag.RBRACE);
                    charNow = this.myLexDocument.getChar();
                }
                else if (charNow === "+") {
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    this.myTokens[this.myTokens.length] = new myToken("+", myTokenOffsetBegin, myTokenOffsetBegin + 1, Tag.ADD);
                    charNow = this.myLexDocument.getChar();
                }
                else if (charNow === "-") {
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    this.myTokens[this.myTokens.length] = new myToken("-", myTokenOffsetBegin, myTokenOffsetBegin + 1, Tag.SUB);
                    charNow = this.myLexDocument.getChar();
                }
                else if (charNow === "*") {
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    this.myTokens[this.myTokens.length] = new myToken("*", myTokenOffsetBegin, myTokenOffsetBegin + 1, Tag.MUL);
                    charNow = this.myLexDocument.getChar();
                }
                else if (charNow === "/") {
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    this.myTokens[this.myTokens.length] = new myToken("/", myTokenOffsetBegin, myTokenOffsetBegin + 1, Tag.DIV);
                    charNow = this.myLexDocument.getChar();
                }
                else if (charNow === ",") {
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    this.myTokens[this.myTokens.length] = new myToken(",", myTokenOffsetBegin, myTokenOffsetBegin + 1, Tag.COMMA);
                    charNow = this.myLexDocument.getChar();
                }
                else if (charNow === ":") {
                    let myTokenOffsetBegin = this.myLexDocument.myDocumentOffset;
                    this.myTokens[this.myTokens.length] = new myToken(":", myTokenOffsetBegin, myTokenOffsetBegin + 1, Tag.COLON);
                    charNow = this.myLexDocument.getChar();
                }
                else {
                    console.log(charNow);
                    charNow = this.myLexDocument.getChar();
                }
            }
            // 跳过空格等
            else if (this.isNoSense(charNow)) {
                do {
                    if ((this.myTokens.length > 0) && (this.myTokens[this.myTokens.length - 1].myTokenVal == "thus"
                        || (this.myTokens[this.myTokens.length - 1].myTokenVal == "follows" && this.myTokens[this.myTokens.length - 2].myTokenVal == "as")
                        || (this.myTokens[this.myTokens.length - 1].myTokenVal == "this" && this.myTokens[this.myTokens.length - 2].myTokenVal == "like"))
                        && (charNow.codePointAt(0) == 32 || charNow.codePointAt(0) == 9)) {
                        let diagnostic = {
                            severity: vscode_languageserver_1.DiagnosticSeverity.Information,
                            range: {
                                start: this.myLexerTextDocument.positionAt(this.myLexDocument.myDocumentOffset - 1),
                                end: this.myLexerTextDocument.positionAt(this.myLexDocument.myDocumentOffset)
                            },
                            message: this.lexErrorList.errorMap["PR3"].errorMessage
                        };
                        this.myDiagnostics.push(diagnostic);
                    }
                    charNow = this.myLexDocument.getChar();
                } while (this.isNoSense(charNow));
            }
            else {
                console.log(charNow);
                charNow = this.myLexDocument.getChar();
            }
        }
    }
    /**
     * addID
     * 转换一下多词的关键词
     */
    addID() {
        for (let i = 0; i < this.myTokens.length; i++) {
            if (this.myTokens[i].myTokenVal === "belong" || this.myTokens[i].myTokenVal === "belongs") {
                if (this.myTokens[i + 1].myTokenVal === "to") {
                    this.myTokens.splice(i, 2, new myToken("belong to", this.myTokens[i].myTokenOffsetStart, this.myTokens[i + 1].myTokenOffsetEnd, Tag.KW_BELONG));
                    i -= 1;
                }
            }
            if (this.myTokens[i].myTokenVal === "-") {
                if (this.myTokens[i + 1].myTag === Tag.NUM && this.myTokens[i].myTokenOffsetEnd === this.myTokens[i + 1].myTokenOffsetStart) {
                    this.myTokens.splice(i, 2, new myToken("-" + this.myTokens[i + 1].myTokenVal, this.myTokens[i].myTokenOffsetStart, this.myTokens[i + 1].myTokenOffsetEnd, Tag.NUM));
                    i -= 1;
                }
            }
            if (this.myTokens[i].myTokenVal === "signed") {
                if (this.myTokens[i + 1].myTokenVal === "integer") {
                    this.myTokens.splice(i, 2, new myToken("signed integer", this.myTokens[i].myTokenOffsetStart, this.myTokens[i + 1].myTokenOffsetEnd, Tag.KW_SIGNED_INTEGER));
                    i -= 1;
                }
            }
        }
    }
}
function getTextDocument(textDocument, preamble) {
    let testLexer = new lexer(textDocument);
    console.log("start");
    testLexer.doLexer();
    testLexer.addID();
    let parser = new ErrorDeal_1.MyParse(testLexer.myTokens, textDocument, preamble);
    parser.check();
    console.log("end");
    for (let tokenTemp of testLexer.myTokens) {
        console.log(tokenTemp.toString());
    }
    let myDiagnosticList = testLexer.myDiagnostics.concat(parser.parseDiagnostic);
    // let myDiagnosticList = testLexer.myDiagnostics;
    return myDiagnosticList;
}
exports.getTextDocument = getTextDocument;
//# sourceMappingURL=textDocuemtLearn.js.map