function purser(input,token_1,token_2){
  //programを定義
  var program = "";
  program = program.split("(").join(" ");
  program = program.split(")").join(" ");
  program = program.split("{").join("");
  program = program.split("}").join("");
  //改行コードごとに区切る
  var mark_brace = input.split("\n");
  //最後に何もない要素を追加
  mark_brace.push("");
  //count_beforeを定義
  var count_before = 0;
  for(var i = 0; i < mark_brace.length; i++){
    var j = 0;
    var count_now = 0;
    while(mark_brace[i].charAt(j) == " "){
      j++;
      count_now++;
    }
    if(count_now > count_before){
      program += "{";
    }else if(count_before > count_now){
      program += "}";
    }
    program += mark_brace[i] + "\n";
    count_before = count_now;
  }

  program = program.split("|").join("|#n|");
  //1文字のトークンを区切る
  for(var i = 0; i < token_1.length; i++){
    program = program.split(token_1[i]).join("|" + token_1[i] + "|");
  }
  //改行コードを区切る
  program = program.split("\n").join("|#n|");
  //空白を区切る
  program = program.split(" ").join("|");
  //区切りが2回以上続いたら1つにする
  while(program.indexOf("||") != -1){
    program = program.split("||").join("|");
  }
  //2文字のトークンを区切る
  program = program.split("*|*|=").join("**=");
  program = program.split("!|=").join("!=");
  program = program.split("<|=").join("<=");
  program = program.split(">|=").join(">=");
  program = program.split("=|=").join("==");
  program = program.split("*|*").join("**");
  program = program.split("+|=").join("+=");
  program = program.split("-|=").join("-=");
  program = program.split("*|=").join("*=");
  program = program.split("/|=").join("/=");
  program = program.split("^|=").join("^=");
  program = program.split("+|+").join("++");
  program = program.split("-|-").join("--");

  //programをreturn
  return program;
}




function perform(){
  const startTime = performance.now();
  var exp = [];
  //デバッグの設定
  if(document.getElementById("debug").checked){
    var debug = true;
  }else{
    var debug = false;
  }
  //inputに入力したプログラムを代入
  var input = document.getElementById("input").value;
  //1文字のトークンを設定
  token_1 = ["=","!",">","<","+","-","*","/","%","^","{","}","(",")","[","]",`"`,";"];
  //2文字のトークンを設定
  token_2 = ["!=","<=",">=","==","**","+="];
  //programを字句解析
  var program = purser(input,token_1,token_2);  
  //区切りごとに配列に代入
  var program_array = program.split("|");
  //不必要な要素は削除
  program_array = program_array.filter(function(a){
    return a !== "(";
  });
  program_array = program_array.filter(function(a){
    return a !== ")";
  });
  program_array = program_array.filter(function(a){
    return a !== "";
  });
  program_array = program_array.filter(function(a){
    return a !== ";";
  });

  var program_type = [];
  var variable = [];
  //サーチ用の変数の準備
  for(var i = 0; i < program_array.length; i++){
    program_type.push("");
  }
  var equal_mode = false;
  //要素の種類分け
  for(var i = 0; i < program_array.length; i++){
    switch(program_array[i]){
      //代入の処理
      case "=":
        if(equal_mode){
          program_type.splice(i,1,"EQUAL")
        }else{
          program_type.splice(i,1,"SUBSTI");
          //"="のひとつ前の要素を"VARIABLE"にする
          program_type.splice(i-1,1,"VARIABLE");
          //変数の名前を配列に追加
          if(variable.indexOf(program_array[i-1]) == -1){
            variable.push(program_array[i-1]);
          }
        }
        break;
      case "+=":
        program_type.splice(i,1,"PLUS_EQUAL");
        break;
      case "-=":
        program_type.splice(i,1,"MINUS_EQUAL");
        break;
      case "*=":
        program_type.splice(i,1,"MULTI_EQUAL");
        break;
      case "/=":
        program_type.splice(i,1,"DIVIS_EQUAL");
        break;
      case "^=":
      case "**=":
        program_type.splice(i,1,"POWER_EQUAL");
        break;
      case "++":
        program_type.splice(i,1,"PLUS_PLUS");
        break;
      case "--":
        program_type.splice(i,1,"MINUS_MINUS");
        break;
      //"+"の場合
      case "+":
        program_type.splice(i,1,"PLUS");
        break;
      //"-"の場合
      case "-":
        program_type.splice(i,1,"MINUS");
        break;
      //"*"の場合
      case "*":
        program_type.splice(i,1,"MULTI");
        break;
      case "%":
        program_type.splice(i,1,"REMAINDE");
        break;
      //"/"の場合
      case "/":
        program_type.splice(i,1,"DIVIS");
        break;
      //"^"の場合
      case "^":
      case "**":
        program_type.splice(i,1,"POWER");
        break;
      //">"の場合
      case ">":
        program_type.splice(i,1,"GREATER");
        break;
      //"<"の場合
      case "<":
        program_type.splice(i,1,"LESS");
        break;
      //">="の場合
      case ">=":
        program_type.splice(i,1,"GREATER_EQUAL");
        break;
      //"<="の場合
      case "<=":
        program_type.splice(i,1,"LESS_EQUAL");
        break;
      //"!="の場合
      case "!=":
        program_type.splice(i,1,"NOT_EQUAL");
        break;
      //"{"の場合
      case "{":
        program_type.splice(i,1,"BRACE_S");
        break;
      //"!="の場合
      case "}":
        program_type.splice(i,1,"BRACE_E");
        break;
      //"while"の場合
      case "while":
      case "繰り返し":
        program_type.splice(i,1,"WHILE");
        equal_mode = true;
        break;
      //"if"の場合
      case "if":
      case "もし":
        program_type.splice(i,1,"IF");
        equal_mode = true;
        break;
      //"else"の場合
      case "else":
      case "でなければ":
        program_type.splice(i,1,"ELSE");
        break;
      case "loop":
      case "ループ":
        program_type.splice(i,1,"LOOP");
        break;
      //"print"の場合
      case "print":
      case "プリント":
        program_type.splice(i,1,"PRINT");
        break;
      //"#n"の場合
      case "#n":
        program_type.splice(i,1,"NEW_LINE");
        equal_mode = false;
        break;
      //"\""の場合
      case "\"":
        program_type.splice(i,1,"DOUBLE_QUOTATION");
        break;
      //その他の場合
      default:
        if(variable.indexOf(program_array[i]) != -1){
          program_type.splice(i,1,"VARIABLE");
        }else{
          if(!isNaN(program_array[i])){
            program_array.splice(i,1,Number(program_array[i]));
            program_type.splice(i,1,"NUMBER");
          }else{
            program_array.splice(i,1,String(program_array[i]));
            program_type.splice(i,1,"STRING");
          }
        }
        break;
    }
  }

  //中間記法→逆ポーランド記法
  for(var i = 0; i < program_type.length; i++){
    switch (program_type[i]){
      case "PLUS":
      case "MINUS":
      case "MULTI":
      case "DIVIS":
      case "POWER":
      case "REMAINDE":
        program_array.splice(i,2,program_array[i+1],program_array[i]);
        program_type.splice(i,2,program_type[i+1],program_type[i]);
        i++;
        break;
    }
  }

  var variable_value = {};
  var while_mode;
  var if_mode;
  var else_mode;
  var loop_mode;
  var while_error = 0;

  for(var i = 0; i < program_type.length; i++){
    switch(program_type[i]){
      case "VARIABLE":
        if(program_type[i+1] == "SUBSTI"){
          var variable_name = program_array[i];
          var judge = true;
          var stack = [];
          i++;
          while(judge){
            i++;
            switch(program_type[i]){
              case "PLUS":
                stack.splice(0,2,stack[0]+stack[1]);
                break;
              case "MINUS":
                stack.splice(0,2,stack[0]-stack[1]);
                break;
              case "MULTI":
                stack.splice(0,2,stack[0]*stack[1]);
                break;
              case "DIVIS":
                stack.splice(0,2,stack[0]/stack[1]);
                break;
              case "POWER":
                stack.splice(0,2,stack[0]**stack[1]);
                break;
              case "REMAINDE":
                stack.splice(0,2,stack[0]%stack[1]);
                break;
              case "NUMBER":
                stack.push(program_array[i]);
                break;
              case "STRING":
                stack.push(program_array[i]);
                break;
              case "VARIABLE":
                stack.push(variable_value[program_array[i]]);
                break;
              default:
                judge = false;
                break;
            }
          }
          variable_value[variable_name] = stack[0];
        }else if(program_type[i+1] == "PLUS_EQUAL"){
          var variable_name = program_array[i];
          var judge = true;
          var stack = [];
          i++;
          while(judge){
            i++;
            switch(program_type[i]){
              case "PLUS":
                stack.splice(0,2,stack[0]+stack[1]);
                break;
              case "MINUS":
                stack.splice(0,2,stack[0]-stack[1]);
                break;
              case "MULTI":
                stack.splice(0,2,stack[0]*stack[1]);
                break;
              case "DIVIS":
                stack.splice(0,2,stack[0]/stack[1]);
                break;
              case "POWER":
                stack.splice(0,2,stack[0]**stack[1]);
                break;
              case "REMAINDE":
                stack.splice(0,2,stack[0]%stack[1]);
                break;
              case "NUMBER":
                stack.push(program_array[i]);
                break;
              case "STRING":
                stack.push(program_array[i]);
                break;
              case "VARIABLE":
                stack.push(variable_value[program_array[i]]);
                break;
              default:
                judge = false;
                break;
            }
          }
          variable_value[variable_name] += stack[0];
        }else if(program_type[i+1] == "MINUS_EQUAL"){
          var variable_name = program_array[i];
          var judge = true;
          var stack = [];
          i++;
          while(judge){
            i++;
            switch(program_type[i]){
              case "PLUS":
                stack.splice(0,2,stack[0]+stack[1]);
                break;
              case "MINUS":
                stack.splice(0,2,stack[0]-stack[1]);
                break;
              case "MULTI":
                stack.splice(0,2,stack[0]*stack[1]);
                break;
              case "DIVIS":
                stack.splice(0,2,stack[0]/stack[1]);
                break;
              case "POWER":
                stack.splice(0,2,stack[0]**stack[1]);
                break;
              case "REMAINDE":
                stack.splice(0,2,stack[0]%stack[1]);
                break;
              case "NUMBER":
                stack.push(program_array[i]);
                break;
              case "STRING":
                stack.push(program_array[i]);
                break;
              case "VARIABLE":
                stack.push(variable_value[program_array[i]]);
                break;
              default:
                judge = false;
                break;
            }
          }
          variable_value[variable_name] -= stack[0];
        }else if(program_type[i+1] == "DIVIS_EQUAL"){
          var variable_name = program_array[i];
          var judge = true;
          var stack = [];
          i++;
          while(judge){
            i++;
            switch(program_type[i]){
              case "PLUS":
                stack.splice(0,2,stack[0]+stack[1]);
                break;
              case "MINUS":
                stack.splice(0,2,stack[0]-stack[1]);
                break;
              case "MULTI":
                stack.splice(0,2,stack[0]*stack[1]);
                break;
              case "DIVIS":
                stack.splice(0,2,stack[0]/stack[1]);
                break;
              case "POWER":
                stack.splice(0,2,stack[0]**stack[1]);
                break;
              case "REMAINDE":
                stack.splice(0,2,stack[0]%stack[1]);
                break;
              case "NUMBER":
                stack.push(program_array[i]);
                break;
              case "STRING":
                stack.push(program_array[i]);
                break;
              case "VARIABLE":
                stack.push(variable_value[program_array[i]]);
                break;
              default:
                judge = false;
                break;
            }
          }
          variable_value[variable_name] /= stack[0];
        }else if(program_type[i+1] == "MULTI_EQUAL"){
          var variable_name = program_array[i];
          var judge = true;
          var stack = [];
          i++;
          while(judge){
            i++;
            switch(program_type[i]){
              case "PLUS":
                stack.splice(0,2,stack[0]+stack[1]);
                break;
              case "MINUS":
                stack.splice(0,2,stack[0]-stack[1]);
                break;
              case "MULTI":
                stack.splice(0,2,stack[0]*stack[1]);
                break;
              case "DIVIS":
                stack.splice(0,2,stack[0]/stack[1]);
                break;
              case "POWER":
                stack.splice(0,2,stack[0]**stack[1]);
                break;
              case "REMAINDE":
                stack.splice(0,2,stack[0]%stack[1]);
                break;
              case "NUMBER":
                stack.push(program_array[i]);
                break;
              case "STRING":
                stack.push(program_array[i]);
                break;
              case "VARIABLE":
                stack.push(variable_value[program_array[i]]);
                break;
              default:
                judge = false;
                break;
            }
          }
          variable_value[variable_name] *= stack[0];
        }else if(program_type[i+1] == "POWER_EQUAL"){
          var variable_name = program_array[i];
          var judge = true;
          var stack = [];
          i++;
          while(judge){
            i++;
            switch(program_type[i]){
              case "PLUS":
                stack.splice(0,2,stack[0]+stack[1]);
                break;
              case "MINUS":
                stack.splice(0,2,stack[0]-stack[1]);
                break;
              case "MULTI":
                stack.splice(0,2,stack[0]*stack[1]);
                break;
              case "DIVIS":
                stack.splice(0,2,stack[0]/stack[1]);
                break;
              case "POWER":
                stack.splice(0,2,stack[0]**stack[1]);
                break;
              case "REMAINDE":
                stack.splice(0,2,stack[0]%stack[1]);
                break;
              case "NUMBER":
                stack.push(program_array[i]);
                break;
              case "STRING":
                stack.push(program_array[i]);
                break;
              case "VARIABLE":
                stack.push(variable_value[program_array[i]]);
                break;
              default:
                judge = false;
                break;
            }
          }
          variable_value[variable_name] **= stack[0];
        }else if(program_type[i+1] == "PLUS_PLUS"){
          variable_value[variable_name]++;
        }else if(program_type[i+1] == "MINUS_MINUS"){
          variable_value[variable_name]--;
        }
        break;
      case "WHILE":
        var stack = [];
        var while_d = [];
        var judge = true;
        while(judge){
          i++;
          switch(program_type[i]){
            case "PLUS":
              stack.splice(0,2,stack[0]+stack[1]);
              break;
            case "MINUS":
              stack.splice(0,2,stack[0]-stack[1]);
              break;
            case "MULTI":
              stack.splice(0,2,stack[0]*stack[1]);
              break;
            case "DIVIS":
              stack.splice(0,2,stack[0]/stack[1]);
              break;
            case "POWER":
              stack.splice(0,2,stack[0]**stack[1]);
              break;
            case "REMAINDE":
              stack.splice(0,2,stack[0]%stack[1]);
              break;
            case "NUMBER":
              stack.push(program_array[i]);
              break;
            case "VARIABLE":
              stack.push(variable_value[program_array[i]]);
              break;
            default:
              judge = false;
              break;
          }
        }
        while_d.push(stack[0]);
        while_d.push(program_type[i]);
        var stack = [];
        var judge = true;
        while(judge){
          i++;
          switch(program_type[i]){
            case "PLUS":
              stack.splice(0,2,stack[0]+stack[1]);
              break;
            case "MINUS":
              stack.splice(0,2,stack[0]-stack[1]);
              break;
            case "MULTI":
              stack.splice(0,2,stack[0]*stack[1]);
              break;
            case "DIVIS":
              stack.splice(0,2,stack[0]/stack[1]);
              break;
            case "POWER":
              stack.splice(0,2,stack[0]**stack[1]);
              break;
            case "REMAINDE":
              stack.splice(0,2,stack[0]%stack[1]);
              break;
            case "NUMBER":
              stack.push(program_array[i]);
              break;
            case "VARIABLE":
              stack.push(variable_value[program_array[i]]);
              break;
            default:
              judge = false;
              break;
          }
        }
        while_d.push(stack[0]);
        var while_judge = false;
        switch(while_d[1]){
          case "EQUAL":
            if(while_d[0] == while_d[2]){
              while_judge = true;
            }else{
              while_judge = false;
            }
            break;
          case "GREATER":
            if(while_d[0] > while_d[2]){
              while_judge = true;
            }else{
              while_judge = false;
            }
            break;
          case "LESS":
            if(while_d[0] < while_d[2]){
              while_judge = true;
            }else{
              while_judge = false;
            }
            break;
          case "GREATER_EQUAL":
            if(while_d[0] >= while_d[2]){
              while_judge = true;
            }else{
              while_judge = false;
            }
            break;
          case "LESS EQUAL":
            if(while_d[0] <= while_d[2]){
              while_judge = true;
            }else{
              while_judge = false;
            }
            break;
          case "NOT_EQUAL":
            if(while_d[0] != while_d[2]){
              while_judge = true;
            }else{
              while_judge = false;
            }
            break;
        }
        if(while_judge){
          i++;
          while_mode = true;
        }else{
          while(program_type[i] != "BRACE_E"){
            i++;
          }
        }
        break;
      
      case "IF":
        var stack = [];
        var if_d = [];
        var judge = true;
        while(judge){
          i++;
          switch(program_type[i]){
            case "PLUS":
              stack.splice(0,2,stack[0]+stack[1]);
              break;
            case "MINUS":
              stack.splice(0,2,stack[0]-stack[1]);
              break;
            case "MULTI":
              stack.splice(0,2,stack[0]*stack[1]);
              break;
            case "DIVIS":
              stack.splice(0,2,stack[0]/stack[1]);
              break;
            case "POWER":
              stack.splice(0,2,stack[0]**stack[1]);
              break;
            case "REMAINDE":
              stack.splice(0,2,stack[0]%stack[1]);
              break;
            case "NUMBER":
              stack.push(program_array[i]);
              break;
            case "VARIABLE":
              stack.push(variable_value[program_array[i]]);
              break;
            default:
              judge = false;
              break;
          }
        }
        if_d.push(stack[0]);
        if_d.push(program_type[i]);
        var stack = [];
        var judge = true;
        while(judge){
          i++;
          switch(program_type[i]){
            case "PLUS":
              stack.splice(0,2,stack[0]+stack[1]);
              break;
            case "MINUS":
              stack.splice(0,2,stack[0]-stack[1]);
              break;
            case "MULTI":
              stack.splice(0,2,stack[0]*stack[1]);
              break;
            case "DIVIS":
              stack.splice(0,2,stack[0]/stack[1]);
              break;
            case "POWER":
              stack.splice(0,2,stack[0]**stack[1]);
              break;
            case "REMAINDE":
              stack.splice(0,2,stack[0]%stack[1]);
              break;
            case "NUMBER":
              stack.push(program_array[i]);
              break;
            case "VARIABLE":
              stack.push(variable_value[program_array[i]]);
              break;
            default:
              judge = false;
              break;
          }
        }
        if_d.push(stack[0]);
        var if_judge = false;
        switch(if_d[1]){
          case "EQUAL":
            if(if_d[0] == if_d[2]){
              if_judge = true;
            }else{
              if_judge = false;
            }
            break;
          case "GREATER":
            if(if_d[0] > if_d[2]){
              if_judge = true;
            }else{
              if_judge = false;
            }
            break;
          case "LESS":
            if(if_d[0] < if_d[2]){
              if_judge = true;
            }else{
              if_judge = false;
            }
            break;
          case "GREATER_EQUAL":
            if(if_d[0] >= if_d[2]){
              if_judge = true;
            }else{
              if_judge = false;
            }
            break;
          case "LESS EQUAL":
            if(if_d[0] <= if_d[2]){
              if_judge = true;
            }else{
              if_judge = false;
            }
            break;
          case "NOT_EQUAL":
            if(if_d[0] != if_d[2]){
              if_judge = true;
            }else{
              if_judge = false;
            }
            break;
        }
        if(if_judge){
          i++;
          if_mode = true;
          else_mode = false;
        }else{
          if_mode = false;
          else_mode = true;
          while(program_type[i] != "BRACE_E"){
            i++;
          }
          i++;
        }
        break;
      
      case "LOOP":
        var stack = [];
        var judge = true;
        while(judge){
          i++;
          switch(program_type[i]){
            case "PLUS":
              stack.splice(0,2,stack[0]+stack[1]);
              break;
            case "MINUS":
              stack.splice(0,2,stack[0]-stack[1]);
              break;
            case "MULTI":
              stack.splice(0,2,stack[0]*stack[1]);
              break;
            case "DIVIS":
              stack.splice(0,2,stack[0]/stack[1]);
              break;
            case "POWER":
              stack.splice(0,2,stack[0]**stack[1]);
              break;
            case "REMAINDE":
              stack.splice(0,2,stack[0]%stack[1]);
              break;
            case "NUMBER":
              stack.push(program_array[i]);
              break;
            case "VARIABLE":
              stack.push(variable_value[program_array[i]]);
              break;
            default:
              judge = false;
              break;
          }
          var loop_count = Math.floor(Number(stack[0])-1);
          if (loop_count > 0){
            loop_mode = true;
          }else{
            while(program_type[i] != "BRACE_E"){
              i++;
            }
            i++;
            loop_mode = false;
          }
        }
        break;


      case "ELSE":
        if(if_mode){
          while(program_type[i] != "BRACE_E"){
            i++;
          }
          i++;
        }
        if(else_mode){
          i =+ 2;
        }
        break;
      

      case "BRACE_E":
        if(while_mode){
          while(program_type[i] != "WHILE"){
            i--;
          }
          i--;
          while_mode = false;
        }
        if(loop_mode){
          if(loop_count > 0){
            while(program_type[i] != "LOOP"){
              i--;
            }
            loop_mode = true;
            loop_count--;
          }else{
            loop_mode = false;
          }
        }

        break;

      case "PRINT":
        var stack = [];
        var judge = true;
        while(judge){
          i++;
          switch(program_type[i]){
            case "PLUS":
              stack.splice(0,2,stack[0]+stack[1]);
              break;
            case "MINUS":
              stack.splice(0,2,stack[0]-stack[1]);
              break;
            case "MULTI":
              stack.splice(0,2,stack[0]*stack[1]);
              break;
            case "DIVIS":
              stack.splice(0,2,stack[0]/stack[1]);
              break;
            case "POWER":
              stack.splice(0,2,stack[0]**stack[1]);
              break;
            case "REMAINDE":
              stack.splice(0,2,stack[0] % stack[1]);
              break;
            case "NUMBER":
              stack.push(program_array[i]);
              break;
            case "VARIABLE":
              stack.push(variable_value[program_array[i]]);
              break;
            default:
              judge = false;
              break;
          }
        }
        exp.push(stack[0]);
        break;
    }
    if(while_mode){
      while_error++;
    }
    if(while_error>1000){
      i = program_type.length;
      exp.unshift('<font color="red">!! time out</font>');
    }
    if(debug){console.log(i);}
  }

  var exp_e = "";

  for(var i = 0; i < exp.length; i++){
    exp_e += exp[i] + "<br>";
  }

  document.getElementById("export").innerHTML = exp_e;

  if(debug){
    console.log(program_array);
    console.log(program_type);
    console.log(variable);
    console.log(variable_value);
  }
  
  const endTime = performance.now();

  console.log(endTime - startTime + "ms");
}