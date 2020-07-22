import {
	TextDocuments,
	TextDocument,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams
} from 'vscode-languageserver';

import {
	Range
} from "vscode-languageserver-types";

import {MyParse, myPreamble} from './ErrorDeal';

export enum ErrorType{
	LEX_WARNING,LEX_ERROR,PARSE_WARNING,PARSE_ERROR,PARSE_RECOMMEND
}

/**
 * 错误类
 * ErrorType 错误类型
 * ErrorMessage：错误信息
 */
export class Error{
	constructor(public errorType:ErrorType,public errorMessage:string){};
}

/**
 * 错误列表
 * errorCode是错误的编号
 * 
 */ 
export class ErrorList{
	errorMap:{[errorCode:string]:Error};
	constructor(){
		this.errorMap = {}
		this.errorMap["PW1"] = new Error(ErrorType.PARSE_WARNING,"数组使用前必须使用reserve语句进行内存空间的分配");//已完成
		this.errorMap["PW2"] = new Error(ErrorType.PARSE_WARNING,"定义引用实体前必须先创建实体对象");//已完成
		this.errorMap["PW3"] = new Error(ErrorType.PARSE_WARNING,"禁止条件判别条件成立时分支无执行语句");//已完成
		this.errorMap["PW4"] = new Error(ErrorType.PARSE_WARNING,"在select语句中必须有default语句");// 已完成
		this.errorMap["PW5"] = new Error(ErrorType.PARSE_WARNING,"禁止使用goto语句");// 已完成
		this.errorMap["PW6"] = new Error(ErrorType.PARSE_WARNING,"禁止重新定义关键字");//已完成
		this.errorMap["PW7"] = new Error(ErrorType.PARSE_WARNING,"数组下标必须是整数");//已完成
		this.errorMap["PW8"] = new Error(ErrorType.PARSE_WARNING,"有返回值的函数中return必须带有返回值");//已完成
		this.errorMap["PW9"] = new Error(ErrorType.PARSE_WARNING,"if或者while后面的判断语句必须用小括号括起来");//已完成
		this.errorMap["PW10"] = new Error(ErrorType.PARSE_WARNING,"禁止将标签定义为关键字和基本类型");//已完成
		this.errorMap["PW11"] = new Error(ErrorType.PARSE_WARNING,"禁止全局变量与局部变量同名");//已完成
		this.errorMap["PW12"] = new Error(ErrorType.PARSE_WARNING,"禁止方法参数个数和顺序与定义的个数和顺序不相同");
		this.errorMap["PW13"] = new Error(ErrorType.PARSE_WARNING,"当指针所指对象被毁灭(destroy)后必须置为0");//
		this.errorMap["PW14"] = new Error(ErrorType.PARSE_WARNING,"禁止函数为空");//已完成
		this.errorMap["PW15"] = new Error(ErrorType.PARSE_WARNING,"禁止给变量赋的值与变量的类型不一致");//
		this.errorMap["PW16"] = new Error(ErrorType.PARSE_WARNING,"禁止将越界整数赋值给整型变量");
		this.errorMap["PW17"] = new Error(ErrorType.PARSE_WARNING,"禁止使用其他类型变量给指针变量赋值");
		this.errorMap["PW18"] = new Error(ErrorType.PARSE_WARNING,"禁止process，event，routine，function的返回值声明类型和实际调用类型不一致");//待定
		this.errorMap["PW19"] = new Error(ErrorType.PARSE_WARNING,"禁止对实数类型的量做是否相等的比较");
		this.errorMap["PW20"] = new Error(ErrorType.PARSE_WARNING,"禁止对指针变量进行大小判断");
		this.errorMap["PW21"] = new Error(ErrorType.PARSE_WARNING,"禁止使用实体名作为实体指针");
		this.errorMap["PW22"] = new Error(ErrorType.PARSE_WARNING,"禁止在内部块中重新定义已有的变量名");
		this.errorMap["PW23"] = new Error(ErrorType.PARSE_WARNING,"禁止局部变量名和函数名同名");//已实现
		this.errorMap["PW24"] = new Error(ErrorType.PARSE_WARNING,"禁止单独使用小写字母“l”或大写字母“O”作为变量名");//已完成
		this.errorMap["PW25"] = new Error(ErrorType.PARSE_WARNING,"禁止更改time.v的值");//已完成
		this.errorMap["PW26"] = new Error(ErrorType.PARSE_WARNING,"在执行事件函数时必须加上start simulation");//部分完成


		this.errorMap["PR1"] = new Error(ErrorType.PARSE_RECOMMEND,"建议在for或者while循环条件后，使用',do'");//已完成
		this.errorMap["PR2"] = new Error(ErrorType.PARSE_RECOMMEND,"建议使用define to mean定义常数"); // 已完成
		this.errorMap["PR3"] = new Error(ErrorType.PARSE_RECOMMEND,"print语句下面的格式行一般不应缩进"); // 已完成
		this.errorMap["PR4"] = new Error(ErrorType.PARSE_RECOMMEND,"避免使用cycle语句");// 已完成
		this.errorMap["PR5"] = new Error(ErrorType.PARSE_RECOMMEND,"建议文件及语法结构长度不宜过长");
		this.errorMap["PR6"] = new Error(ErrorType.PARSE_RECOMMEND,"函数中避免使用过多的参数，建议不要超过10个");//已完成
		this.errorMap["PR7"] = new Error(ErrorType.PARSE_RECOMMEND,"建议不使用for each");//已完成
		this.errorMap["PR8"] = new Error(ErrorType.PARSE_RECOMMEND,"建议逻辑表达式尽量少使用is false");//已完成
		this.errorMap["PR9"] = new Error(ErrorType.PARSE_RECOMMEND,"使用标签跳转，读取最大的下标值建议不超过3000");//已完成
		this.errorMap["PR10"] = new Error(ErrorType.PARSE_RECOMMEND,"谨慎做整型量除以整型量的计算");
		this.errorMap["PR11"] = new Error(ErrorType.PARSE_RECOMMEND,"谨慎使用不同类型的混合运算");
		this.errorMap["PR12"] = new Error(ErrorType.PARSE_RECOMMEND,"建议避免函数仅含有返回语句");//已完成
		this.errorMap["PR13"] = new Error(ErrorType.PARSE_RECOMMEND,"谨慎在循环体内部修改循环控制变量");
		this.errorMap["PR14"] = new Error(ErrorType.PARSE_RECOMMEND,"建议使用带类型前缀的变量名");//已完成
		this.errorMap["PR15"] = new Error(ErrorType.PARSE_RECOMMEND,"定义事件函数执行的优先级");
		this.errorMap["PR16"] = new Error(ErrorType.PARSE_RECOMMEND,"尽量不要在事件函数外修改其所需的变量");
		this.errorMap["PR17"] = new Error(ErrorType.PARSE_RECOMMEND,"谨慎使用对象已经被毁灭的指针");

		this.errorMap["PU1"] = new Error(ErrorType.PARSE_RECOMMEND,"尽量避免变量名中出现数字编号");//已完成
		this.errorMap["PU2"] = new Error(ErrorType.PARSE_RECOMMEND,"建议常量全0用大写字母，用下划线分割单词");//部分完成
		this.errorMap["PU3"] = new Error(ErrorType.PARSE_RECOMMEND,"避免使用过长的标识符，一般小于15个字符");//已完成
		this.errorMap["PU4"] = new Error(ErrorType.PARSE_RECOMMEND,"建议if语句的换行使用8个空格的规则");
		this.errorMap["PU5"] = new Error(ErrorType.PARSE_RECOMMEND,"建议一行声明一个变量");//已完成
		this.errorMap["PU6"] = new Error(ErrorType.PARSE_RECOMMEND,"建议一元操作符和操作数之间不加空格");//部分完成
		this.errorMap["PU7"] = new Error(ErrorType.PARSE_RECOMMEND,"建议二元运算符与操作数之间用空格分开");//
		this.errorMap["PU8"] = new Error(ErrorType.PARSE_RECOMMEND,"函数名之后不要留空格，应紧跟左括号‘(’");
		this.errorMap["PU9"] = new Error(ErrorType.PARSE_RECOMMEND,"每行的长度避免超过80字符");

		
	};
}

/**
 * *语法
 * KW开头表明是关键词
 */
export enum Tag{
	PARSE_INIT, // 后面parse的初始化标志
	ERR,//错误
	ID,//标识符
	KW_INT,KW_TEXT,KW_DOUBLE,KW_REAL,KW_CONSTANT,KW_POINTER, // 类型符号,TODO:查询*文档完善
	NUM,str, // 数字和字符串
	ADD,SUB,MUL,DIV, // 加减乘除
	GT,GE,LT,LE,EQU,NEQU, // 比较符号
	LPAREN,RPAREN,LBRACK,RBRACK,LBARCE,RBRACE, // 括号
	COMMA,COLON, // 逗号
	ASSIGN, //赋值，
	KW_DO,KW_WHILE,KW_END,KW_FOR,KW_SWITCH,KW_LEAVE,KW_ALWAYS,KW_EACH,KW_LOOP,KW_CYCLE,KW_WITH, //循环控制关键词
	KW_IF,KW_ELSE, // 判断
	KW_FILE,KW_REMOVE,KW_ENTITY,KW_EVERY,KW_HAVE,KW_OWNS,KW_BELONG,KW_SET,KW_FROM,KW_FIFO,KW_LIFO, // 实体和集合
	KW_SELECT,KW_ENDSELECT,KW_CASE,KW_DEFAULT,// switch
	KW_RETURN, //return
	KW_PREAMBLE,KW_INCLUDING,KW_SYSTEM,KW_SUBSYSTEM,KW_MAIN,KW_ROUTINE,KW_FUNCTION,KW_PROCESS,KW_EVENT,//这行即以下为simscript特有
	KW_GIVEN,KW_YIELDING,KW_DEFINE,KW_ARTICLE,KW_THIS,KW_AS,KW_VARIABLE,KW_REFERENCE,KW_ARGUMENT,KW_DIMENSION,
	KW_NORMALLY,KW_MODE,KW_NOT,KW_IS,KW_TEMPORARY,KW_PERMANENT,KW_CALL,KW_CREATE,KW_CALLED,KW_ACTIVITY,
	KW_SCHEDULE,KW_WAIT,KW_WORK,KW_UNIT,KW_IN,KW_AT,KW_START,KW_SIMULATON,KW_READ,KW_WRITE,KW_PRINT,KW_LINE,KW_LET,
	KW_RESERVE,KW_OPEN,KW_INPUT,KW_OUTPUT,KW_NAME,KW_USE,KW_THUS,KW_EMPTY,KW_MEAN,KW_ALPHA,KW_GO,KW_SIGNED_INTEGER,
	KW_DUMMY,KW_SUBPROGRAM,KW_STREAM,KW_ARRAY,KW_ALL,KW_DESTROY,KW_SUBROUTINE,KW_THEN,KW_OTHERWISE,KW_ENDIF,KW_REGARDLESS,
	KW_NEXTLINE, //换行
	KW_TO,KW_BELONGS, // 用以合成的
	KW_TIME,//time.v
	KW_ACTIVATE,//activate
	LABEL//标签
}

class myKeyWords{
	keyword:{[index:string]:Tag};
	constructor(){
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
		this.keyword['return'] = Tag.KW_RETURN;
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
		this.keyword['dimension'] = Tag.KW_DIMENSION
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
		this.keyword['destroy'] = Tag.KW_DESTROY;
		this.keyword["subroutine"] = Tag.KW_SUBROUTINE;
		this.keyword['then'] = Tag.KW_THEN;
		this.keyword['otherwise'] = Tag.KW_OTHERWISE;
		this.keyword['endif'] = Tag.KW_ENDIF;
		this.keyword['regardless'] = Tag.KW_REGARDLESS;
		this.keyword['time.v'] = Tag.KW_TIME;
		this.keyword['activate'] = Tag.KW_ACTIVATE;
 	};
	/**
	 * getTag
	 * 获取对应的Tag（判断是不是关键词）
	 */
	public getTag(name:string) {
		if(this.keyword[name]!=null)
		{
			return this.keyword[name];
		}
		else{
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
export class myToken{
	constructor(public myTokenVal:string, public myTokenOffsetStart:number,
		public myTokenOffsetEnd:number,public myTag:Tag){};
	
	/**
	 * toString
	 */
	public toString():string {
		let tempString:string = "";
		tempString += this.myTokenVal + "|" + this.myTokenOffsetStart + "|" + this.myTokenOffsetEnd + "|" + this.myTag;
		return tempString;
	}
}

class myDocument{
	myDocumentOffset:number;
	constructor(public myTextDocument:TextDocument){
		this.myDocumentOffset = 0;
	};
	/**
	 * getChar，获取一个字符,offset+1;
	 * 超过边界的时候返回""
	 */
	public getChar(): string{
		let myDocumentPositionStart = this.myTextDocument.positionAt(this.myDocumentOffset);
		let myDocumentPositionEnd = this.myTextDocument.positionAt(this.myDocumentOffset+1);
		// range好像是左闭右开的
		let myDocumentRange:Range = {
			start:myDocumentPositionStart,
			end:myDocumentPositionEnd
		};
		this.myDocumentOffset+=1;
		return this.myTextDocument.getText(myDocumentRange);
	}

	/**
	 * 回到前一个字符
	 */
	public preChar(){
		this.myDocumentOffset-=1;
	}
}

/**
 * 词法分析类
 * myTokens:词法分析结果
 * myKeyword:关键词表
 * myDiagonstics: 诊断列表
 */
class lexer{
	myTokens:Array<myToken>;
	myLexDocument:myDocument;
	myKeywords:myKeyWords;
	myDiagnostics:Array<Diagnostic>;
	lexErrorList:ErrorList;
	constructor(public myLexerTextDocument:TextDocument){
		this.myTokens = new Array<myToken>();
		this.myLexDocument = new myDocument(myLexerTextDocument);
		this.myKeywords = new myKeyWords();
		this.myDiagnostics = new Array<Diagnostic>();
		this.lexErrorList = new ErrorList();
	};

	/**
	 * isDigit
	 * 判断一个字符是不是数字
	 */
	public isDigit(toDoString:string):boolean {
		let pattern = /\d/g;
		let m = pattern.exec(toDoString);
		if(!!m)
		{
			return true;
		}
		return false;
	};

	/**
	 * isAlpha
	 * 判断一个字符是不是字母
	 */
	public isAlpha(toDoString:string):boolean {
		let pattern = /[A-Za-z]/g;
		let m = pattern.exec(toDoString);
		if(!!m)
		{
			return true;
		}
		return false;
	}

	/**
	 * isSymbol
	 * 判断一个字符是不是符号
	 */
	public isSymbol(toDoString:string):boolean {
		let pattern= /\W/g;
		let m = pattern.exec(toDoString);
		if(!!m&&!this.isNoSense(toDoString))
		{
			return true;
		}
		return false;
	}

	/**
	 * isNoSense
	 */
	public isNoSense(toDoString:string):boolean {
		let pattern= /\s/g;
		let m = pattern.exec(toDoString);
		if(!!m)
		{
			return true;
		}
		return false;
	}


	/**
	 * doLexer
	 */
	public doLexer() {
		let charNow = this.myLexDocument.getChar();
		
		while(charNow!=="")
		{
			// 判断关键词和标识符
			if(this.isAlpha(charNow) || charNow==="_")
			{
				let stringTemp:string = "";
				let offsetTempBegin:number = this.myLexDocument.myDocumentOffset;
				do{
					stringTemp+=charNow;
					charNow = this.myLexDocument.getChar();
				}while(this.isAlpha(charNow) ||charNow==="." || charNow ==="_" || this.isDigit(charNow));
				stringTemp = stringTemp.toLowerCase();
				if(stringTemp=="to" && this.myTokens[this.myTokens.length-1].myTokenVal=="go")
				{
					let diagnostic:Diagnostic = {
						severity:DiagnosticSeverity.Warning,
						range:{
							start : this.myLexerTextDocument.positionAt(this.myTokens[this.myTokens.length-1].myTokenOffsetStart-1),
							end: this.myLexerTextDocument.positionAt(this.myLexDocument.myDocumentOffset)
						},
						message:this.lexErrorList.errorMap['PW5'].errorMessage
					};
					this.myDiagnostics.push(diagnostic);
				}
				else if(stringTemp=="cycle")
				{
					let diagnostic:Diagnostic = {
						severity:DiagnosticSeverity.Information,
						range: {
							start: this.myLexerTextDocument.positionAt(offsetTempBegin-1),
							end:this.myLexerTextDocument.positionAt(this.myLexDocument.myDocumentOffset)
						},
						message:this.lexErrorList.errorMap["PR4"].errorMessage
					};
					this.myDiagnostics.push(diagnostic)
				}
				else if(stringTemp=="false" && this.myTokens[this.myTokens.length-1].myTokenVal=="is")
				{
					let diagnostic:Diagnostic = {
						severity:DiagnosticSeverity.Information,
						range:{
							start : this.myLexerTextDocument.positionAt(this.myTokens[this.myTokens.length-1].myTokenOffsetStart-1),
							end: this.myLexerTextDocument.positionAt(this.myLexDocument.myDocumentOffset)
						},
						message:this.lexErrorList.errorMap["PR8"].errorMessage
					};
					this.myDiagnostics.push(diagnostic)
				}
				let tagTemp:Tag = this.myKeywords.getTag(stringTemp);
				this.myTokens[this.myTokens.length] = new myToken(stringTemp,offsetTempBegin,this.myLexDocument.myDocumentOffset,tagTemp);
			}

			// 判断数字
			else if(this.isDigit(charNow))
			{
				let stringTemp:string = "";
				let offsetTempBegin:number = this.myLexDocument.myDocumentOffset;
				do{
					stringTemp+=charNow;
					charNow = this.myLexDocument.getChar();
				}while(this.isDigit(charNow) || charNow===".");
				this.myTokens[this.myTokens.length] = new myToken(stringTemp,offsetTempBegin,this.myLexDocument.myDocumentOffset,Tag.NUM);
			}

			//判断符号
			else if(this.isSymbol(charNow))
			{
			
				if(charNow==="'")
				{
					charNow = this.myLexDocument.getChar();
					if(charNow=="'")
					{
						do{
							charNow = this.myLexDocument.getChar();							
						}while(charNow!=="\n" && charNow!=="");
						charNow = this.myLexDocument.getChar();
					}
					// label的情况
					else{
						let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
						let myLabel:string = ""
						while(charNow!="'")
						{
							myLabel+=charNow;
							charNow = this.myLexDocument.getChar();
						}
						this.myTokens[this.myTokens.length] = new myToken(myLabel,myTokenOffsetBegin,this.myLexDocument.myDocumentOffset,Tag.LABEL);
						if(this.myKeywords.getTag(myLabel) != Tag.ID)
						{
							let diagnostic = {
								severity:DiagnosticSeverity.Warning,
								range:{
									start:this.myLexerTextDocument.positionAt(myTokenOffsetBegin-1),
									end:this.myLexerTextDocument.positionAt(this.myLexDocument.myDocumentOffset-1)
								},
								message:this.lexErrorList.errorMap["PW10"].errorMessage
							};
							this.myDiagnostics.push(diagnostic);
						}
						//label下标值的情况
						if(myLabel.indexOf("(")!=-1 && myLabel.indexOf(")")!=-1){
							let numArr:number = Number(myLabel.match(/\d+/g))
							if(numArr>3000){
								let diagnostic = {
									severity:DiagnosticSeverity.Information,
									range:{
										start:this.myLexerTextDocument.positionAt(myTokenOffsetBegin-1),
										end:this.myLexerTextDocument.positionAt(this.myLexDocument.myDocumentOffset-1)
									},
									message:this.lexErrorList.errorMap["PR9"].errorMessage
								};
								this.myDiagnostics.push(diagnostic);
							} 
					
						}
						charNow = this.myLexDocument.getChar();
					}

				}
				
				else if(charNow==="/")
				{
					charNow= this.myLexDocument.getChar();
					let charPre = charNow;
					let charPrePre = "";
					if(charNow === "~")
					{
						do{
							charPrePre = charPre;
							charPre = charNow;
							charNow = this.myLexDocument.getChar();
						}while((charPrePre==="/" || charNow!=="/" || charPre !=="~") && charNow!=="");
						charNow = this.myLexDocument.getChar();
					}
				}

				else if(charNow==="\"")
				{
					charNow = this.myLexDocument.getChar();
					let stringTemp = ""
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					while(charNow!==""&&charNow!=="\"")
					{
						stringTemp+=charNow;
						charNow = this.myLexDocument.getChar();
					}

					this.myTokens[this.myTokens.length] = new myToken(stringTemp,myTokenOffsetBegin,this.myLexDocument.myDocumentOffset,Tag.str);
				}

				else if(charNow==="=")
				{
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					charNow = this.myLexDocument.getChar();
					if(this.myTokens[this.myTokens.length-1].myTag==Tag.KW_TIME)
					{
						let diagnostic = {
							severity:DiagnosticSeverity.Warning,
							range:{
								start:this.myLexerTextDocument.positionAt(myTokenOffsetBegin-8),
								end:this.myLexerTextDocument.positionAt(this.myLexDocument.myDocumentOffset-1)
							},
							message:this.lexErrorList.errorMap["PW25"].errorMessage
						};
						this.myDiagnostics.push(diagnostic);

					}
					
					

					if(charNow!=="=")
					{
						this.myTokens[this.myTokens.length] = new myToken("=",myTokenOffsetBegin,this.myLexDocument.myDocumentOffset,Tag.ASSIGN);
					} 
					else{
						this.myTokens[this.myTokens.length] = new myToken("==",myTokenOffsetBegin,this.myLexDocument.myDocumentOffset+1,Tag.EQU);
						charNow = this.myLexDocument.getChar();
					}
				}

				else if(charNow===">")
				{
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					charNow = this.myLexDocument.getChar();
					if(charNow!=="=")
					{
						this.myTokens[this.myTokens.length] = new myToken(">",myTokenOffsetBegin,this.myLexDocument.myDocumentOffset,Tag.GT);
					} 
					else{
						this.myTokens[this.myTokens.length] = new myToken(">=",myTokenOffsetBegin,this.myLexDocument.myDocumentOffset+1,Tag.GE);
						charNow = this.myLexDocument.getChar();
					}
				}

				else if(charNow==="<")
				{
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					charNow = this.myLexDocument.getChar();

					if(charNow===">")
					{
						this.myTokens[this.myTokens.length] = new myToken("<",myTokenOffsetBegin,this.myLexDocument.myDocumentOffset,Tag.NEQU);
					} 
					else if(charNow!=="=")
					{
						this.myTokens[this.myTokens.length] = new myToken("<",myTokenOffsetBegin,this.myLexDocument.myDocumentOffset,Tag.LT);
					}
					else{
						this.myTokens[this.myTokens.length] = new myToken("<=",myTokenOffsetBegin,this.myLexDocument.myDocumentOffset+1,Tag.LE);
						charNow = this.myLexDocument.getChar();
					}
				}

				
				else if(charNow==="(")
				{
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					this.myTokens[this.myTokens.length] = new myToken("(",myTokenOffsetBegin,myTokenOffsetBegin+1,Tag.LPAREN);
					charNow = this.myLexDocument.getChar();
					
				}

				else if(charNow===")")
				{
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					this.myTokens[this.myTokens.length] = new myToken(")",myTokenOffsetBegin,myTokenOffsetBegin+1,Tag.RPAREN);
					charNow = this.myLexDocument.getChar();
				}

				else if(charNow==="[")
				{
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					this.myTokens[this.myTokens.length] = new myToken("[",myTokenOffsetBegin,myTokenOffsetBegin+1,Tag.LBRACK);
					charNow = this.myLexDocument.getChar();
				}

				else if(charNow==="]")
				{
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					this.myTokens[this.myTokens.length] = new myToken("]",myTokenOffsetBegin,myTokenOffsetBegin+1,Tag.RBRACK);
					charNow = this.myLexDocument.getChar();
				}

				else if(charNow==="{")
				{
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					this.myTokens[this.myTokens.length] = new myToken("{",myTokenOffsetBegin,myTokenOffsetBegin+1,Tag.LBARCE);
					charNow = this.myLexDocument.getChar();
				}

				else if(charNow==="}")
				{
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					this.myTokens[this.myTokens.length] = new myToken("}",myTokenOffsetBegin,myTokenOffsetBegin+1,Tag.RBRACE);
					charNow = this.myLexDocument.getChar();
				}

				else if(charNow==="+")
				{
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					this.myTokens[this.myTokens.length] = new myToken("+",myTokenOffsetBegin,myTokenOffsetBegin+1,Tag.ADD);
					charNow = this.myLexDocument.getChar();
				}

				else if(charNow==="-")
				{
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					this.myTokens[this.myTokens.length] = new myToken("-",myTokenOffsetBegin,myTokenOffsetBegin+1,Tag.SUB);
					if(this.myTokens[this.myTokens.length-1].myTag==Tag.ASSIGN && this.myTokens[this.myTokens.length+1].myTag==Tag.NUM)
						{
							let diagnostic = {
								severity:DiagnosticSeverity.Information,
								range:{
									start:this.myLexerTextDocument.positionAt(myTokenOffsetBegin-1),
									end:this.myLexerTextDocument.positionAt(this.myLexDocument.myDocumentOffset-1)
								},
								message:this.lexErrorList.errorMap["PU6"].errorMessage
							};
							this.myDiagnostics.push(diagnostic);
						}
					charNow = this.myLexDocument.getChar();
				}

				else if(charNow==="*")
				{
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					this.myTokens[this.myTokens.length] = new myToken("*",myTokenOffsetBegin,myTokenOffsetBegin+1,Tag.MUL);
					charNow = this.myLexDocument.getChar();
				}

				else if(charNow==="/")
				{
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					this.myTokens[this.myTokens.length] = new myToken("/",myTokenOffsetBegin,myTokenOffsetBegin+1,Tag.DIV);
					charNow = this.myLexDocument.getChar();
				}

				else if(charNow===",")
				{
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					this.myTokens[this.myTokens.length] = new myToken(",",myTokenOffsetBegin,myTokenOffsetBegin+1,Tag.COMMA);
					charNow = this.myLexDocument.getChar();
				}

				else if(charNow===":")
				{
					let myTokenOffsetBegin:number = this.myLexDocument.myDocumentOffset;
					this.myTokens[this.myTokens.length] = new myToken(":",myTokenOffsetBegin,myTokenOffsetBegin+1,Tag.COLON);
					charNow = this.myLexDocument.getChar();
				}

				else{
					console.log(charNow);
					charNow = this.myLexDocument.getChar();
				}
				
			}
			
			// 跳过空格等
			else if(this.isNoSense(charNow))
			{
				
				do{
					if((this.myTokens.length>0)&&(this.myTokens[this.myTokens.length-1].myTokenVal=="thus" 
					|| (this.myTokens[this.myTokens.length-1].myTokenVal=="follows" && this.myTokens[this.myTokens.length-2].myTokenVal=="as")
					|| (this.myTokens[this.myTokens.length-1].myTokenVal=="this" && this.myTokens[this.myTokens.length-2].myTokenVal=="like"))
					&& (charNow.codePointAt(0)==32 || charNow.codePointAt(0)==9))
					{
						let diagnostic:Diagnostic={
							severity:DiagnosticSeverity.Information,
							range:{
								start:this.myLexerTextDocument.positionAt(this.myLexDocument.myDocumentOffset-1),
								end:this.myLexerTextDocument.positionAt(this.myLexDocument.myDocumentOffset)
							},
							message:this.lexErrorList.errorMap["PR3"].errorMessage
						}
						this.myDiagnostics.push(diagnostic)
					}
					charNow = this.myLexDocument.getChar();
				}while(this.isNoSense(charNow))
			}

			else{
				console.log(charNow);
				charNow = this.myLexDocument.getChar();
			}
		}
	
	}

	/**
	 * addID
	 * 转换一下多词的关键词
	 */
	public addID () {
		for(let i=0;i<this.myTokens.length;i++)
		{
			if(this.myTokens[i].myTokenVal==="belong" || this.myTokens[i].myTokenVal==="belongs")
			{
				if(this.myTokens[i+1].myTokenVal==="to")
				{
					this.myTokens.splice(i,2,new myToken("belong to",this.myTokens[i].myTokenOffsetStart,this.myTokens[i+1].myTokenOffsetEnd,Tag.KW_BELONG));
					i-=1;
				}
			}
			if(this.myTokens[i].myTokenVal === "-")
			{
				if(this.myTokens[i+1].myTag === Tag.NUM && this.myTokens[i].myTokenOffsetEnd===this.myTokens[i+1].myTokenOffsetStart)
				{
					this.myTokens.splice(i,2,new myToken("-"+this.myTokens[i+1].myTokenVal,this.myTokens[i].myTokenOffsetStart,this.myTokens[i+1].myTokenOffsetEnd,Tag.NUM));
					i-=1;
				}
			}
			if(this.myTokens[i].myTokenVal === "signed")
			{
				if(this.myTokens[i+1].myTokenVal === "integer")
				{
					this.myTokens.splice(i,2,new myToken("signed integer",this.myTokens[i].myTokenOffsetStart,this.myTokens[i+1].myTokenOffsetEnd,Tag.KW_SIGNED_INTEGER));
					i-=1;
				}
			}
		}
	}
}

export function getTextDocument(textDocument:TextDocument,preamble:myPreamble):Diagnostic[]{
	
	let testLexer = new lexer(textDocument);
	console.log("start");
	
	testLexer.doLexer();
	testLexer.addID();
	let parser = new MyParse(testLexer.myTokens,textDocument,preamble);
	parser.check();
	console.log("end");
	for(let tokenTemp of testLexer.myTokens){
		console.log(tokenTemp.toString());
	}

	let myDiagnosticList = testLexer.myDiagnostics.concat(parser.parseDiagnostic);
	// let myDiagnosticList = testLexer.myDiagnostics;
	return myDiagnosticList;
}
