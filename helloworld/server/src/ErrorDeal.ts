//保证在编译通过的基础上完成语法分析
import {Tag,myToken,ErrorType,Error,ErrorList} from './textDocuemtLearn';
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



class VariableDefine{
	constructor(public variableName:string,public tag:Tag){};
}

class VariableDefinationList{
	variableDefinations:Map<string,VariableDefine>;
	constructor(){
		this.variableDefinations = new Map();
	}
}

export class ArrayDefine{
	arrays:Map<string,boolean>;
	constructor(){
		this.arrays = new Map();
	}
}

export class myEntity{
	constructor(public name:string,public isCreate:Tag,public entityTag:Tag){};

	public setIsCreate(isCreateTag:Tag)
	{
		this.isCreate = isCreateTag;
	}
}

export class myEntityList{
	entityMap:Map<string,myEntity>;
	constructor(){
		this.entityMap = new Map();
	};
}

export class myPreamble{
	arrayDefinationList:ArrayDefine;
	entityList:myEntityList;
	variables:VariableDefinationList;
	constructor(){
		this.arrayDefinationList = new ArrayDefine();
		this.entityList = new myEntityList();
		this.variables = new VariableDefinationList();
	};

	/**
	 * clear
	 */
	public clear() {
		this.arrayDefinationList.arrays.clear();
		this.entityList.entityMap.clear();
	}
}

class RoutineParameter{
	constructor(public parameterName:string,public parameterTag:Tag){};
}

class RoutineParameterList{
	routineParameters:Map<string,RoutineParameter>;
	hasGiven:boolean;
	hasYielding:boolean;
	numberGiven:number;
	constructor(){
		this.routineParameters = new Map();
		this.hasGiven = false;
		this.hasYielding = false;
		this.numberGiven = 0;
	}

	/**
	 * clear
	 */
	public clear() {
		this.hasGiven = false;
		this.hasYielding = false;
		this.routineParameters.clear();
		this.numberGiven = 0;
	}
}

export class MyParse{

	parsePreambleLocal:myPreamble;//本文件的定义信息
	parsePosition:number;//判断到的指针
	parseDiagnostic:Array<Diagnostic>;//诊断信息
	variabledefinations:Array<VariableDefine>;// 变量定义
	parseErrorList:ErrorList;//错误列表
	selectPosition:number;//select位置信息
	parseRoutineParameterList:RoutineParameterList;


	// 标记位
	isPreamble:boolean;
	entityTag:Tag;
	defineTag:Tag;
	level:number;
	normallyMode:Tag;
	preambleEndOffset:number;

	constructor(public myTokens:Array<myToken>,public parseDocument:TextDocument,public parsePreamble:myPreamble){
		this.parseDiagnostic = new Array<Diagnostic>();
		this.variabledefinations = new Array<VariableDefine>();
		this.parsePosition = 0;
		this.parseErrorList = new ErrorList();
		this.parsePreambleLocal = new myPreamble();
		this.parseRoutineParameterList = new RoutineParameterList();

		this.selectPosition = -1;
		this.isPreamble = false;
		this.entityTag =Tag.KW_TEMPORARY;
		this.defineTag=Tag.PARSE_INIT;
		this.normallyMode=Tag.PARSE_INIT;
		this.level = 0;
		this.preambleEndOffset = -1;
	};

	
	
	/**
	 * match
	 */
	public match() {
		this.parsePosition+=1;
	}
	
	/**
	 * define
	 * 当碰到最后时返回值为false，其他一直为true
	 */
	public define() {
		let startOffset = this.myTokens[this.parsePosition].myTokenOffsetStart;
		let startParsePosition = this.parsePosition;//存的define
		let millionStone:number;//存的as等

		this.match();
		while(this.myTokens[this.parsePosition].myTag!=Tag.KW_AS && this.myTokens[this.parsePosition].myTag!=Tag.KW_TO)
		{
			if(this.myTokens[this.parsePosition].myTag == Tag.ID)
			{
				this.parsePreamble.variables.variableDefinations.set(this.myTokens[this.parsePosition].myTokenVal,new VariableDefine(
				this.myTokens[this.parsePosition].myTokenVal,Tag.PARSE_INIT))
			}
			this.match();
		}

		// as 语句,现在只完成了基本的
		millionStone = this.parsePosition;
		if(this.myTokens[this.parsePosition].myTag == Tag.KW_AS)
		{
			let tempType:Tag;
			this.match();
			// 去掉a，an
			if(this.myTokens[this.parsePosition].myTag == Tag.KW_ARTICLE)
			{
				this.match();
			}

			// constant定义，引发警告PR1-1
			if(this.myTokens[this.parsePosition].myTag == Tag.KW_CONSTANT)
			{
				let diagonsitic:Diagnostic = {
					severity : DiagnosticSeverity.Information,
					range:{
						start : this.parseDocument.positionAt(startOffset-1),
						end : this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
					},
					message:this.parseErrorList.errorMap["PR2"].errorMessage
				};
				this.parseDiagnostic.push(diagonsitic);
			}

			// set TODO
			else if(this.myTokens[this.parsePosition].myTag == Tag.KW_FIFO || this.myTokens[this.parsePosition].myTag == Tag.KW_LIFO)
			{
				this.match();
			}

			// variables,array
			else if(this.myTokens[this.parsePosition].myTag == Tag.KW_SIGNED_INTEGER || this.myTokens[this.parsePosition].myTag == Tag.KW_INT
				|| this.myTokens[this.parsePosition].myTag == Tag.KW_REAL || this.myTokens[this.parsePosition].myTag == Tag.KW_DOUBLE
				|| this.myTokens[this.parsePosition].myTag == Tag.KW_ALPHA|| this.myTokens[this.parsePosition].myTag == Tag.KW_TEXT)
				{
					do{
						this.match();
					}while(this.myTokens[this.parsePosition].myTag != Tag.KW_VARIABLE && this.myTokens[this.parsePosition].myTag != Tag.KW_ARRAY
						&& this.myTokens[this.parsePosition].myTag != Tag.KW_ROUTINE && this.myTokens[this.parsePosition].myTag != Tag.KW_FUNCTION);
					
					if(this.myTokens[this.parsePosition].myTag == Tag.KW_ARRAY)
					{
						for(let i:number = startParsePosition;i<=millionStone;i++)
						{
							if(this.myTokens[i].myTag == Tag.ID)
							{
								this.parsePreamble.arrayDefinationList.arrays.set(this.myTokens[i].myTokenVal,false);
							}

						}
					}
				}
		}
	}

	/**
	 * define
	 * 当碰到最后时返回值为false，其他一直为true
	 */
	public define_local() {
		let startOffset = this.myTokens[this.parsePosition].myTokenOffsetStart;
		let startParsePosition = this.parsePosition;
		let millionStone:number;
		this.match();
		while(this.myTokens[this.parsePosition].myTag!=Tag.KW_AS && this.myTokens[this.parsePosition].myTag!=Tag.KW_TO)
		{
			if(this.myTokens[this.parsePosition].myTag == Tag.ID)
			{
				if(this.parsePreamble.variables.variableDefinations.has(this.myTokens[this.parsePosition].myTokenVal))
				{
					let diagonsitic:Diagnostic = {
						severity:DiagnosticSeverity.Warning,
						range:{
							start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
							end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
						},
						message:this.parseErrorList.errorMap["PW11"].errorMessage
					}
					this.parseDiagnostic.push(diagonsitic)
				}
				else if((this.myTokens[this.parsePosition].myTokenVal.toUpperCase()=="O") || (this.myTokens[this.parsePosition].myTokenVal=="l")){
					let diagonsitic:Diagnostic = {
						severity:DiagnosticSeverity.Warning,
						range:{
							start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
							end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
						},
						message:this.parseErrorList.errorMap["PW24"].errorMessage
					}
					this.parseDiagnostic.push(diagonsitic)
				}

				else if((this.myTokens[this.parsePosition].myTokenVal.substr(0,1)!='i'&&this.myTokens[this.parsePosition].myTokenVal.substr(0,1)!='r'
				&&this.myTokens[this.parsePosition].myTokenVal.substr(0,1)!='d'&&this.myTokens[this.parsePosition].myTokenVal.substr(0,1)!='t'
				&&this.myTokens[this.parsePosition].myTokenVal.substr(0,1)!='p'&&this.myTokens[this.parsePosition].myTokenVal.substr(0,1)!='a'))
				{
					let diagonsitic:Diagnostic = {
						severity:DiagnosticSeverity.Information,
						range:{
							start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
							end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
						},
						message:this.parseErrorList.errorMap["PR15"].errorMessage
					}
					this.parseDiagnostic.push(diagonsitic)
				}

				
				
				
				else if(!!this.myTokens[this.parsePosition].myTokenVal.match(/\d/g))
				{
					let diagonsitic:Diagnostic = {
						severity:DiagnosticSeverity.Information,
						range:{
							start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
							end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
						},
						message:this.parseErrorList.errorMap["PU1"].errorMessage
					}
					this.parseDiagnostic.push(diagonsitic)
				}
				
				else if(this.myTokens[this.parsePosition].myTokenVal.length>15)
				{
					let diagonsitic:Diagnostic = {
						severity:DiagnosticSeverity.Information,
						range:{
							start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
							end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
						},
						message:this.parseErrorList.errorMap["PU3"].errorMessage
					}
					this.parseDiagnostic.push(diagonsitic)
				}

				else if((this.myTokens[this.parsePosition+1].myTag == Tag.KW_TO && this.myTokens[this.parsePosition+2].myTag == Tag.KW_MEAN) &&
					this.myTokens[this.parsePosition].myTokenVal!=this.myTokens[this.parsePosition].myTokenVal.toUpperCase())
				{
					let diagonsitic:Diagnostic = {
						severity:DiagnosticSeverity.Information,
						range:{
							start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
							end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
						},
						message:this.parseErrorList.errorMap["PU2"].errorMessage
					}
					this.parseDiagnostic.push(diagonsitic)
				}
				else if(this.myTokens[this.parsePosition+1].myTag != Tag.KW_AS)
				{
					let diagonsitic:Diagnostic = {
						severity:DiagnosticSeverity.Information,
						range:{
							start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
							end:this.parseDocument.positionAt(this.myTokens[this.parsePosition+1].myTokenOffsetEnd)
						},
						message:this.parseErrorList.errorMap["PU5"].errorMessage
					}
					this.parseDiagnostic.push(diagonsitic)
				}
			}
			else if(this.myTokens[this.parsePosition].myTag != Tag.ID && this.myTokens[this.parsePosition].myTag != Tag.COMMA)
			{
				let diagonsitic:Diagnostic = {
					severity:DiagnosticSeverity.Warning,
					range:{
						start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
						end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
					},
					message:this.parseErrorList.errorMap["PW6"].errorMessage
				}
				this.parseDiagnostic.push(diagonsitic)
			}
			this.match();
		}

		// as 语句,现在只完成了基本的
		millionStone = this.parsePosition;
		if(this.myTokens[this.parsePosition].myTag == Tag.KW_AS)
		{
			let tempType:Tag;
			this.match();
			// 去掉a，an
			if(this.myTokens[this.parsePosition].myTag == Tag.KW_ARTICLE)
			{
				this.match();
			}

			// constant定义，引发警告PR1-1
			if(this.myTokens[this.parsePosition].myTag == Tag.KW_CONSTANT)
			{
				let diagonsitic:Diagnostic = {
					severity : DiagnosticSeverity.Information,
					range:{
						start : this.parseDocument.positionAt(startOffset-1),
						end : this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
					},
					message:this.parseErrorList.errorMap["PR2"].errorMessage
				};
				this.parseDiagnostic.push(diagonsitic);
			}

			// set TODO
			else if(this.myTokens[this.parsePosition].myTag == Tag.KW_FIFO || this.myTokens[this.parsePosition].myTag == Tag.KW_LIFO)
			{
				this.match();
			}

			// variables,array
			else if(this.myTokens[this.parsePosition].myTag == Tag.KW_SIGNED_INTEGER || this.myTokens[this.parsePosition].myTag == Tag.KW_INT
				|| this.myTokens[this.parsePosition].myTag == Tag.KW_REAL || this.myTokens[this.parsePosition].myTag == Tag.KW_DOUBLE
				|| this.myTokens[this.parsePosition].myTag == Tag.KW_ALPHA|| this.myTokens[this.parsePosition].myTag == Tag.KW_TEXT)
				{
					do{
						this.match();
					}while(this.myTokens[this.parsePosition].myTag != Tag.KW_VARIABLE && this.myTokens[this.parsePosition].myTag != Tag.KW_ARRAY
						&& this.myTokens[this.parsePosition].myTag != Tag.KW_ROUTINE && this.myTokens[this.parsePosition].myTag != Tag.KW_FUNCTION);
					
					if(this.myTokens[this.parsePosition].myTag == Tag.KW_ARRAY)
					{
						for(let i:number = startParsePosition;i<=millionStone;i++)
						{
							if(this.myTokens[i].myTag == Tag.ID)
							{
								this.parsePreambleLocal.arrayDefinationList.arrays.set(this.myTokens[i].myTokenVal,false);
							}

						}
					}
				}
		}
	}

	/**
	 * every
	 */
	public every() {

		do{
			this.match();
			if(this.myTokens[this.parsePosition].myTag == Tag.ID)
			{
				this.parsePreamble.entityList.entityMap.set(this.myTokens[this.parsePosition].myTokenVal,
					new myEntity(this.myTokens[this.parsePosition].myTokenVal,Tag.PARSE_INIT,this.entityTag));
			}
		}while(this.myTokens[this.parsePosition].myTag == Tag.ID || this.myTokens[this.parsePosition].myTag == Tag.COMMA);

		return;
	}

	/**
	 * create
	 */
	public create(){

		this.match();

		//去掉冠词
		if(this.myTokens[this.parsePosition].myTag==Tag.KW_ARTICLE)
		{
			this.match();
		}

		//表明必然是临时实体
		if(this.myTokens[this.parsePosition].myTag == Tag.ID)
		{
			// 有别名的临时实体
			if(this.myTokens[this.parsePosition+1].myTag == Tag.KW_CALLED)
			{
				this.match();//变成了called
				this.match();//变成了called的对象
				this.parsePreambleLocal.entityList.entityMap.set(this.myTokens[this.parsePosition].myTokenVal,
					new myEntity(this.myTokens[this.parsePosition].myTokenVal,Tag.KW_CREATE,Tag.KW_TEMPORARY));
					this.match();
			}
			else{
				this.parsePreambleLocal.entityList.entityMap.set(this.myTokens[this.parsePosition].myTokenVal,
					new myEntity(this.myTokens[this.parsePosition].myTokenVal,Tag.KW_CREATE,Tag.KW_TEMPORARY));
					this.match();
			}
		}

		//永久实体
		else if(this.myTokens[this.parsePosition].myTag == Tag.KW_EACH || this.myTokens[this.parsePosition].myTag == Tag.KW_ALL
			|| this.myTokens[this.parsePosition].myTag == Tag.KW_EVERY)
			{
				let parseLine:number = this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart).line;
				this.match();
				do{
					
					if(this.myTokens[this.parsePosition].myTag == Tag.ID && this.parsePreamble.entityList.entityMap.has(this.myTokens[this.parsePosition].myTokenVal))
					{
						this.parsePreambleLocal.entityList.entityMap.set(this.myTokens[this.parsePosition].myTokenVal,new myEntity(
							this.myTokens[this.parsePosition].myTokenVal,Tag.KW_CREATE,Tag.KW_PERMANENT
						))
					}
					this.match();
				}while((this.myTokens[this.parsePosition].myTag == Tag.ID || this.myTokens[this.parsePosition].myTag == Tag.COMMA)&&
				this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart).line == parseLine);
			}
		
	}

	/**
	 * destory
	 */
	public destory(){

		this.match();

		//去掉冠词
		if(this.myTokens[this.parsePosition].myTag==Tag.KW_ARTICLE || this.myTokens[this.parsePosition].myTag == Tag.KW_THIS)
		{
			this.match();
		}

		//表明必然是临时实体
		if(this.myTokens[this.parsePosition].myTag == Tag.ID)
		{
			let diagonsitic:Diagnostic = {
				severity:DiagnosticSeverity.Warning,
				range:{
					start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
					end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
				},
				message:this.parseErrorList.errorMap["PW13"].errorMessage
			}
			this.parseDiagnostic.push(diagonsitic);
			// 有别名的临时实体
			if(this.myTokens[this.parsePosition+1].myTag == Tag.KW_CALLED)
			{
				this.match();//变成了called
				this.match();//变成了called的对象

				if(this.myTokens[this.parsePosition].myTag == Tag.ID){
					let diagonsitic:Diagnostic = {
						severity:DiagnosticSeverity.Warning,
						range:{
							start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
							end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
						},
						message:this.parseErrorList.errorMap["PW13"].errorMessage
					}
					this.parseDiagnostic.push(diagonsitic);
				}
				this.parsePreambleLocal.entityList.entityMap.get(this.myTokens[this.parsePosition].myTokenVal)?.setIsCreate(Tag.KW_DESTROY);
					
					this.match();
			}
			else{
				this.parsePreambleLocal.entityList.entityMap.get(this.myTokens[this.parsePosition].myTokenVal)?.setIsCreate(Tag.KW_DESTROY);
					this.match();
			}
		}

		//永久实体
		else if(this.myTokens[this.parsePosition].myTag == Tag.KW_EACH || this.myTokens[this.parsePosition].myTag == Tag.KW_ALL
			|| this.myTokens[this.parsePosition].myTag == Tag.KW_EVERY)
			{
				let parseLine:number = this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart).line;
				this.match();
				do{
					
					if(this.myTokens[this.parsePosition].myTag == Tag.ID && this.parsePreamble.entityList.entityMap.has(this.myTokens[this.parsePosition].myTokenVal))
					{
						this.parsePreambleLocal.entityList.entityMap.get(this.myTokens[this.parsePosition].myTokenVal)?.setIsCreate(Tag.KW_DESTROY)
					}
					this.match();
				}while((this.myTokens[this.parsePosition].myTag == Tag.ID || this.myTokens[this.parsePosition].myTag == Tag.COMMA)&&
				this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart).line == parseLine);
				let diagonsitic:Diagnostic = {
						severity:DiagnosticSeverity.Warning,
						range:{
							start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
							end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
						},
						message:this.parseErrorList.errorMap["PW13"].errorMessage
					}
					this.parseDiagnostic.push(diagonsitic);
				}
			}
	
	/**
	 * given
	 */
	public given() {
		this.match();
		let startOffset:number = this.myTokens[this.parsePosition].myTokenOffsetStart;
		let endOffset:number = this.myTokens[this.parsePosition].myTokenOffsetEnd;
		
		while(true)
		{
			this.parseRoutineParameterList.routineParameters.set(this.myTokens[this.parsePosition].myTokenVal,
				new RoutineParameter(this.myTokens[this.parsePosition].myTokenVal,Tag.KW_GIVEN));
			endOffset = this.myTokens[this.parsePosition].myTokenOffsetEnd;
			this.match();
			this.parseRoutineParameterList.numberGiven+=1;
			if(this.myTokens[this.parsePosition].myTag != Tag.COMMA)
			{
				break;
			}
			else{
				this.match();
			}
		}
		if(this.parseRoutineParameterList.numberGiven>10)
		{
			let diagonsitic:Diagnostic = {
				severity:DiagnosticSeverity.Information,
				range:{
					start:this.parseDocument.positionAt(startOffset-1),
					end:this.parseDocument.positionAt(endOffset)
				},
				message:this.parseErrorList.errorMap["PR7"].errorMessage
			}
			this.parseDiagnostic.push(diagonsitic);
		}
		//判断routine只有return语句
		if (this.myTokens[this.parsePosition].myTag == Tag.KW_RETURN) {
			let diagonsitic: Diagnostic = {
				severity: DiagnosticSeverity.Information,
				range: {
					start: this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
					end: this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
				},
				message: this.parseErrorList.errorMap["PR13"].errorMessage
			}
			this.parseDiagnostic.push(diagonsitic);
		}

		//判断routine为空
		if (this.myTokens[this.parsePosition].myTag == Tag.KW_END) {
			let diagonsitic: Diagnostic = {
				severity: DiagnosticSeverity.Warning,
				range: {
					start: this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
					end: this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
				},
				message: this.parseErrorList.errorMap["PW14"].errorMessage
			}
			this.parseDiagnostic.push(diagonsitic);
		}
	}
	
	/**
	 * if_stmt
	 */
	public if_stmt() {
		let if_line:number = this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart).line;
		this.match();
		if(this.myTokens[this.parsePosition].myTag == Tag.KW_ELSE || this.myTokens[this.parsePosition].myTag == Tag.KW_IF
			|| this.myTokens[this.parsePosition].myTag == Tag.KW_OTHERWISE || this.myTokens[this.parsePosition].myTag == Tag.KW_THEN
			|| this.myTokens[this.parsePosition].myTag == Tag.KW_ALWAYS || this.myTokens[this.parsePosition].myTag == Tag.KW_ENDIF
			|| this.myTokens[this.parsePosition].myTag == Tag.KW_REGARDLESS)
			{
				let diagonsitic:Diagnostic = {
					severity:DiagnosticSeverity.Warning,
					range:{
						start:this.parseDocument.positionAt(this.myTokens[this.parsePosition-1].myTokenOffsetStart-1),
						end:this.parseDocument.positionAt(this.myTokens[this.parsePosition-1].myTokenOffsetEnd-1)
					},
						message:this.parseErrorList.errorMap["PW3"].errorMessage
				}
				this.parseDiagnostic.push(diagonsitic);
					
			}
		if(this.myTokens[this.parsePosition+1].myTag != Tag.LPAREN)
		{
			
			let diagonsitic:Diagnostic = {
				severity:DiagnosticSeverity.Warning,
				range:{
					start:this.parseDocument.positionAt(this.myTokens[this.parsePosition-1].myTokenOffsetStart-1),
					end:this.parseDocument.positionAt(this.myTokens[this.parsePosition-1].myTokenOffsetEnd-1)
				},
					message:this.parseErrorList.errorMap["PW9"].errorMessage
			}
			this.parseDiagnostic.push(diagonsitic);
		}
	}

	/**
	 * while_stmt
	 */
	public while_stmt() {
		let while_start:number = this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd).line;
		this.match();
		if(this.myTokens[this.parsePosition].myTag != Tag.LPAREN)
		{
			let diagonsitic:Diagnostic = {
				severity:DiagnosticSeverity.Warning,
				range:{
					start:this.parseDocument.positionAt(this.myTokens[this.parsePosition-1].myTokenOffsetStart-1),
					end:this.parseDocument.positionAt(this.myTokens[this.parsePosition-1].myTokenOffsetEnd-1)
				},
				message:this.parseErrorList.errorMap["PW9"].errorMessage
			}
			this.parseDiagnostic.push(diagonsitic);
		}
		let judgeStart:number = this.myTokens[this.parsePosition].myTokenOffsetStart;
		let judgeEnd:number = this.myTokens[this.parsePosition].myTokenOffsetEnd;
		
		while(this.myTokens[this.parsePosition].myTag != Tag.KW_DO)
		{
			judgeEnd = this.myTokens[this.parsePosition].myTokenOffsetEnd;
			this.match();
		}
		if(this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart).line != while_start)
		{
			let diagonsitic:Diagnostic = {
				severity:DiagnosticSeverity.Information,
				range:{
					start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
					end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd-1)
				},
				message:this.parseErrorList.errorMap["PR1"].errorMessage
			}
			this.parseDiagnostic.push(diagonsitic);
		}
		this.match();
		
	}

	/**
	 * yielding
	 */
	public yielding() {
		this.match();
		this.parseRoutineParameterList.hasYielding = true;
		while (true) {
			this.match();
			if (this.myTokens[this.parsePosition].myTag != Tag.COMMA) {
				break;
			}
			else {
				this.match();
			}
		}
		//判断routine只有return语句
		if (this.myTokens[this.parsePosition].myTag == Tag.KW_RETURN){
			let diagonsitic: Diagnostic = {
				severity: DiagnosticSeverity.Information,
				range: {
					start: this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
					end: this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
				},
				message: this.parseErrorList.errorMap["PR13"].errorMessage
			}
			this.parseDiagnostic.push(diagonsitic);
		}
		
		//判断routine为空
		if(this.myTokens[this.parsePosition].myTag == Tag.KW_END){
			let diagonsitic: Diagnostic = {
				severity: DiagnosticSeverity.Warning,
				range: {
					start: this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
					end: this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
				},
				message: this.parseErrorList.errorMap["PW14"].errorMessage
			}
			this.parseDiagnostic.push(diagonsitic);
		}
	}
	
	/**
	 * statement
	 * 包含常用的statement
	 * TODO:完善
	 */
	public statement() {
		while(true)
		{
			if(this.myTokens[this.parsePosition].myTag == Tag.KW_DEFINE)
			{
				this.define_local();
			}
			else if(this.myTokens[this.parsePosition].myTag == Tag.KW_RESERVE)
			{
				this.reserve();
			}
			else if(this.myTokens[this.parsePosition].myTag == Tag.KW_EVERY)
			{
				this.every();
			}
			else if(this.myTokens[this.parsePosition].myTag == Tag.KW_CREATE)
			{
				this.create();
			}
			else if(this.myTokens[this.parsePosition].myTag == Tag.KW_DESTROY)
			{
				this.destory();
			}
			else if(this.myTokens[this.parsePosition].myTag == Tag.KW_GIVEN)
			{
				this.given();
			}
			else if(this.myTokens[this.parsePosition].myTag == Tag.KW_YIELDING)
			{
				this.yielding();
			}
			else if(this.myTokens[this.parsePosition].myTag == Tag.KW_IF)
			{
				this.if_stmt();
			}
			else if(this.myTokens[this.parsePosition].myTag == Tag.KW_WHILE)
			{
				this.while_stmt();
			}
			else if(this.myTokens[this.parsePosition].myTag == Tag.KW_FOR)
			{
				this.for_stmt();
			}
			//函数为空的情况
			else if ((this.myTokens[this.parsePosition].myTag == Tag.KW_FUNCTION
				|| this.myTokens[this.parsePosition].myTag == Tag.KW_PROCESS)
				&& this.myTokens[this.parsePosition + 1].myTag == Tag.ID) {
				let startOffset: number = this.myTokens[this.parsePosition].myTokenOffsetStart;
				let endOffset: number = 0;
				let endAppear: boolean = false;
				this.match();
				this.match();
				if (this.parsePosition < this.myTokens.length &&
					this.myTokens[this.parsePosition].myTag == Tag.KW_END) {
					endAppear = true;
					endOffset = this.myTokens[this.parsePosition].myTokenOffsetEnd;
					this.match();
				}

				if (this.parsePosition < this.myTokens.length &&
					this.myTokens[this.parsePosition].myTag == Tag.KW_GIVEN && !endAppear) {
					this.match();
					while (true) {
						this.match();
						if (this.myTokens[this.parsePosition].myTag != Tag.COMMA) {
							break;
						}
						else {
							this.match();
						}
					}
					if (this.parsePosition < this.myTokens.length &&
						this.myTokens[this.parsePosition].myTag == Tag.KW_END) {
						endAppear = true;
						endOffset = this.myTokens[this.parsePosition].myTokenOffsetEnd;
						this.match();
					}
				}
				else if(this.parsePosition < this.myTokens.length &&
					this.myTokens[this.parsePosition].myTag == Tag.LPAREN && !endAppear){
					this.match();
					while (true) {
						this.match();
						if (this.myTokens[this.parsePosition].myTag == Tag.RPAREN) {
							break;
						}
						else {
							this.match();
						}
					}
					this.match();
					if (this.parsePosition < this.myTokens.length &&
						this.myTokens[this.parsePosition].myTag == Tag.KW_END) {
						endAppear = true;
						endOffset = this.myTokens[this.parsePosition].myTokenOffsetEnd;
						this.match();
					}
				}

				if(endAppear){
					let diagonsitic: Diagnostic = {
						severity: DiagnosticSeverity.Warning,
						range: {
							start: this.parseDocument.positionAt(startOffset - 1),
							end: this.parseDocument.positionAt(endOffset)
						},
						message: this.parseErrorList.errorMap["PW14"].errorMessage
					}
					this.parseDiagnostic.push(diagonsitic);
				}
				console.log();

				if (this.parsePosition >= this.myTokens.length) {
					break;
				}
				
			}
			else if (this.myTokens[this.parsePosition].myTag == Tag.KW_ROUTINE
				&& this.myTokens[this.parsePosition + 1].myTag == Tag.ID) {
				let startOffset: number = this.myTokens[this.parsePosition].myTokenOffsetStart;
				let endOffset: number = 0;
				let endAppear: boolean = false;
				this.match();
				this.match();
				if (this.parsePosition < this.myTokens.length &&
					this.myTokens[this.parsePosition].myTag == Tag.KW_END) {
					endAppear = true;
					endOffset = this.myTokens[this.parsePosition].myTokenOffsetEnd;
					this.match();
				}

				if (this.parsePosition < this.myTokens.length &&
					this.myTokens[this.parsePosition].myTag == Tag.KW_GIVEN && !endAppear) {
					this.match();
					while (true) {
						this.match();
						if (this.myTokens[this.parsePosition].myTag != Tag.COMMA) {
							break;
						}
						else {
							this.match();
						}
					}
					if (this.parsePosition < this.myTokens.length &&
						this.myTokens[this.parsePosition].myTag == Tag.KW_END) {
						endAppear = true;
						endOffset = this.myTokens[this.parsePosition].myTokenOffsetEnd;
						this.match();
					}
				}
				else if(this.parsePosition < this.myTokens.length &&
					this.myTokens[this.parsePosition].myTag == Tag.LPAREN && !endAppear){
					this.match();
					while (true) {
						this.match();
						if (this.myTokens[this.parsePosition].myTag == Tag.RPAREN) {
							break;
						}
						else {
							this.match();
						}
					}
					this.match();
					if (this.parsePosition < this.myTokens.length &&
						this.myTokens[this.parsePosition].myTag == Tag.KW_END) {
						endAppear = true;
						endOffset = this.myTokens[this.parsePosition].myTokenOffsetEnd;
						this.match();
					}
				}

				if (this.parsePosition < this.myTokens.length &&
					this.myTokens[this.parsePosition].myTag == Tag.KW_YIELDING && !endAppear) {
					this.match();
					while (true) {
						this.match();
						if (this.myTokens[this.parsePosition].myTag != Tag.COMMA) {
							break;
						}
						else {
							this.match();
						}
					}
					if (this.parsePosition < this.myTokens.length &&
						this.myTokens[this.parsePosition].myTag == Tag.KW_END) {
						endAppear = true;
						endOffset = this.myTokens[this.parsePosition].myTokenOffsetEnd;
						this.match();
					}
				}
				if(endAppear){
					let diagonsitic: Diagnostic = {
						severity: DiagnosticSeverity.Warning,
						range: {
							start: this.parseDocument.positionAt(startOffset - 1),
							end: this.parseDocument.positionAt(endOffset)
						},
						message: this.parseErrorList.errorMap["PW14"].errorMessage
					}
					this.parseDiagnostic.push(diagonsitic);
				}
				console.log();

				if (this.parsePosition >= this.myTokens.length) {
					break;
				}
				
			}
            
			else if(this.myTokens[this.parsePosition].myTag == Tag.KW_END)
			{
				this.match();
				this.parseRoutineParameterList.clear();
				if(this.parsePosition<this.myTokens.length)
				{
					continue;
				}
				else{
					break;
				}
			}
			else{
				//Array 查找
				if(this.parsePreamble.arrayDefinationList.arrays.has(this.myTokens[this.parsePosition].myTokenVal)&& this.parsePreamble.arrayDefinationList.arrays.get(this.myTokens[this.parsePosition].myTokenVal)==false)
				{
					let diagonsitic:Diagnostic={
						severity:DiagnosticSeverity.Warning,
						range:{
							start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
							end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
						},
						message:this.parseErrorList.errorMap["PW1"].errorMessage
					}
					this.parseDiagnostic.push(diagonsitic);
				}
				if(this.parsePreambleLocal.arrayDefinationList.arrays.has(this.myTokens[this.parsePosition].myTokenVal)&& this.parsePreambleLocal.arrayDefinationList.arrays.get(this.myTokens[this.parsePosition].myTokenVal)==false)
				{
					let diagonsitic:Diagnostic={
						severity:DiagnosticSeverity.Warning,
						range:{
							start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
							end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
						},
						message:this.parseErrorList.errorMap["PW1"].errorMessage
					}
					this.parseDiagnostic.push(diagonsitic);
				}
				if(this.parsePreamble.arrayDefinationList.arrays.has(this.myTokens[this.parsePosition].myTokenVal)
				|| this.parsePreambleLocal.arrayDefinationList.arrays.has(this.myTokens[this.parsePosition].myTokenVal))
				{
					if(this.myTokens[this.parsePosition+1].myTag == Tag.LPAREN && this.myTokens[this.parsePosition+3].myTag == Tag.RPAREN)
					{
						if(this.myTokens[this.parsePosition+2].myTokenVal.indexOf(".")!=-1)
						{
							let diagonsitic:Diagnostic = {
								severity:DiagnosticSeverity.Warning,
								range:{
									start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
									end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
								},
								message:this.parseErrorList.errorMap["PW7"].errorMessage
							}
							this.parseDiagnostic.push(diagonsitic);
						}
					}
				}

				// entity查找
				if(this.parsePreamble.entityList.entityMap.has(this.myTokens[this.parsePosition].myTokenVal))
				{
					// 永久实体或者临时实体
					if((!this.parsePreambleLocal.entityList.entityMap.has(this.myTokens[this.parsePosition].myTokenVal)) ||
						this.parsePreambleLocal.entityList.entityMap.get(this.myTokens[this.parsePosition].myTokenVal)?.isCreate!=Tag.KW_CREATE)
					{
						let diagonsitic:Diagnostic={
							severity:DiagnosticSeverity.Warning,
							range:{
								start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
								end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
							},
							message:this.parseErrorList.errorMap["PW2"].errorMessage,
						}
						this.parseDiagnostic.push(diagonsitic);
					}
				}

				// select查找
				if(this.myTokens[this.parsePosition].myTag == Tag.KW_SELECT)
				{
					this.selectPosition = this.parsePosition;
				}
				if(this.myTokens[this.parsePosition].myTag == Tag.KW_DEFAULT)
				{
					this.selectPosition = -1;
				}
				if(this.myTokens[this.parsePosition].myTag == Tag.KW_ENDSELECT && this.selectPosition != -1)
				{
					let diagonsitic:Diagnostic = {
						severity:DiagnosticSeverity.Warning,
						range:{
							start:this.parseDocument.positionAt(this.myTokens[this.selectPosition].myTokenOffsetStart-1),
							end:this.parseDocument.positionAt(this.myTokens[this.selectPosition].myTokenOffsetEnd-1)
						},
						message:this.parseErrorList.errorMap["PW4"].errorMessage
					}
					this.parseDiagnostic.push(diagonsitic);
				}

				//return 查找
				if(this.myTokens[this.parsePosition].myTag == Tag.KW_RETURN && this.parseRoutineParameterList.hasYielding)
				{
					if(this.parseDocument.positionAt(this.myTokens[this.parsePosition+1].myTokenOffsetStart).line!=
					this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd).line)
					{
						let diagonsitic:Diagnostic = {
							severity:DiagnosticSeverity.Warning,
							range:{
								start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
								end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd)
							},
							message:this.parseErrorList.errorMap["PW8"].errorMessage
						}
						this.parseDiagnostic.push(diagonsitic);
					}
				}
				//if 查找
				if(this.myTokens[this.parsePosition].myTag == Tag.KW_ELSE || this.myTokens[this.parsePosition].myTag == Tag.KW_OTHERWISE)
				{
					if(this.myTokens[this.parsePosition+1].myTag == Tag.KW_ALWAYS || this.myTokens[this.parsePosition+1].myTag == Tag.KW_ENDIF
						|| this.myTokens[this.parsePosition+1].myTag == Tag.KW_REGARDLESS)
						{
							let diagonsitic:Diagnostic = {
								severity:DiagnosticSeverity.Warning,
								range:{
									start:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetStart-1),
									end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd-1)
								},
								message:this.parseErrorList.errorMap["PW3"].errorMessage
							}
							this.parseDiagnostic.push(diagonsitic);
						}
				}
				this.match();
			}
		}
		
	}

	/**
	 * judgeStatement
	 * 包含判断语句
	 */
	public judgeStatement(){

	}

	/**
	 * 全局判断信息
	 */
	public checkGobal(){

	}

	/**
	 * for_stmt
	 */
	public for_stmt() {
		let for_start = this.myTokens[this.parsePosition].myTokenOffsetStart;
		this.match();
		if(this.myTokens[this.parsePosition].myTag == Tag.KW_EACH)
		{
			let diagonsitic:Diagnostic = {
				severity:DiagnosticSeverity.Information,
				range:{
					start:this.parseDocument.positionAt(for_start-1),
					end:this.parseDocument.positionAt(this.myTokens[this.parsePosition].myTokenOffsetEnd-1)
				},
				message:this.parseErrorList.errorMap["PR8"].errorMessage
			};
			this.parseDiagnostic.push(diagonsitic);
			this.match();
		}
	}

	/**
	 * reserve
	 */
	public reserve() {

		this.match();
		do{
			if(this.myTokens[this.parsePosition].myTag == Tag.ID)
			{
				if(this.parsePreamble.arrayDefinationList.arrays.has(this.myTokens[this.parsePosition].myTokenVal))
				{
					this.parsePreamble.arrayDefinationList.arrays.delete(this.myTokens[this.parsePosition].myTokenVal);
					this.parsePreamble.arrayDefinationList.arrays.set(this.myTokens[this.parsePosition].myTokenVal,true);
				}
				if(this.parsePreambleLocal.arrayDefinationList.arrays.has(this.myTokens[this.parsePosition].myTokenVal))
				{
					this.parsePreambleLocal.arrayDefinationList.arrays.delete(this.myTokens[this.parsePosition].myTokenVal);
					this.parsePreambleLocal.arrayDefinationList.arrays.set(this.myTokens[this.parsePosition].myTokenVal,true);
				}
			}
			this.match();
		}while(this.myTokens[this.parsePosition].myTag != Tag.KW_AS);

		this.match();//匹配as


	}

	/**
	 * getVariableLength
	 * 获取变量长度
	 */
	public getVariableLength(flag:number,variablePosition:number) {
		let count = 0;
		let b_level = 0;
		let is_reach = false;
		//正向查找
		if(flag == 1)
		{
			if(this.myTokens[variablePosition].myTag==Tag.ID)
			{
				is_reach = true;
			}
		}
		else
		{
			
		}
	}

	/**
	 * check
	 * 寻找有问题的地方
	 */
	public check() {

		// premable
		if(this.myTokens[this.parsePosition].myTag == Tag.KW_PREAMBLE)
		{
			this.parsePreamble.clear();
			this.isPreamble = true;
			while(true)
			{
				//define语句
				if(this.myTokens[this.parsePosition].myTag == Tag.KW_DEFINE)
				{
					this.define();
				}

				//permanent entities
				if(this.myTokens[this.parsePosition].myTag == Tag.KW_PERMANENT)
				{
					this.match();
					this.match();
					this.entityTag = Tag.KW_PERMANENT;
				}

				//temporary entities
				if(this.myTokens[this.parsePosition].myTag == Tag.KW_TEMPORARY)
				{
					this.match();
					this.match();
					this.entityTag = Tag.KW_TEMPORARY;
				}

				// every
				if(this.myTokens[this.parsePosition].myTag == Tag.KW_EVERY)
				{
					this.every();
				}

				//end
				if(this.myTokens[this.parsePosition].myTag == Tag.KW_END)
				{
					this.preambleEndOffset = this.parsePosition;
					this.match();
					this.isPreamble = false;
					// 后面没东西了
					if(this.myTokens.length <= this.parsePosition)
					{
						return;
					}
					break;
				}

				if(this.myTokens[this.parsePosition].myTag == Tag.KW_NORMALLY)
				{
					this.match();

				}

				else{
					console.log(this.myTokens[this.parsePosition].myTokenVal);
					this.match();
					continue;
				}
			}
		}
		else{
			// 处理非preamble语句
			this.statement();

		}
		
	}
	
	
}
