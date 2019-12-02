var chainnetConfig = {
    mainnet: {
        name: "主网",
        contractAddress: "",
        host: "https://mainnet.nebulas.io",
        payhost: "https://pay.nebulas.io/api/mainnet/pay"
    },
    testnet: {
        name: "测试网",
        contractAddress: "n1fYnrZ3eiBJrkC5DnbooGMJjHZz8EwffPH",
        host: "https://testnet.nebulas.io",
        payhost: "https://pay.nebulas.io/api/pay"
    }
}

var chainInfo = chainnetConfig["testnet"];
var HttpRequest = require("nebulas").HttpRequest;
var Neb = require("nebulas").Neb;
var Unit = require("nebulas").Unit;
var Utils = require("nebulas").Utils;

var myneb = new Neb();
myneb.setRequest(new HttpRequest(chainInfo.host));
var nasApi = myneb.api;


var NebPay = require("nebpay");
var nebPay = new NebPay();



//if (typeof(webExtensionWallet) === "undefined") {

  //alert("请首先安装webExtensionWallet插件");
//}


$(".loading_div").hide();
$(".show_human_detail").hide();
$(".no_address").hide();


var dappAddress = chainInfo.contractAddress;



$("#input_clid").click(function() {
    var clid = $("#clid").val();
    var to = dappAddress;
    var value = "0";
    var callFunction = "searchCreditLetter";
    var callArgs = "[\""+clid+"\"]";
    nebPay.simulateCall(to, value, callFunction, callArgs, {
        listener: getAccountListener
    });
    $(".loading_div").show();
    $(".input_clid").hide();
})

$("#confirm").click(function() {
    var clid = $("#clid").val();
    var to = dappAddress;
    var value = "0";
    var callFunction = "confirmCreditLetter";
    var callArgs = "[\""+clid+"\"]";
    nebPay.call(to, value, callFunction, callArgs, {
        listener: Listener
    });
    $(".loading_div").show();
    $(".input_clid").hide();
})

$("#unconfirm").click(function() {
    var clid = $("#clid").val();
    var to = dappAddress;
    var value = "0";
    var callFunction = "unconfirmCreditLetter";
    var callArgs = "[\""+clid+"\"]";
    nebPay.call(to, value, callFunction, callArgs, {
        listener: Listener
    });
    $(".loading_div").show();
    $(".input_clid").hide();
})

$("#withd").click(function() {
    var clid = $("#clid").val();
    var to = dappAddress;
    var value = "0";
    var callFunction = "withdraw";
    var callArgs = "[\""+clid+"\"]";
    nebPay.call(to, value, callFunction, callArgs, {
        listener: Listener
    });
    $(".loading_div").show();
    $(".input_clid").hide();
})

// function Listener(resp) {

//     if (resp.result == "Error: 10001"){
//         alert("没有当前ID的信用证！");
//         $(".show_human_detail").hide();
//         $(".no_address").show();
//         $(".loading_div").hide();
//         $(".input_clid").hide();
//         $(".confirmCreditLetter").hide();
//         $(".unconfirmCreditLetter").hide();
//         $(".withdraw").hide();
//         $(".0").show();
//         $(".1").hide();
//         $(".2").hide();
//     }
//     else if (resp.result == "Error: 10002"){
//         alert("出口人账户不正确，请更换账户");
//         $(".show_human_detail").hide();
//         $(".no_address").show();
//         $(".loading_div").hide();
//         $(".input_clid").hide();
//         $(".confirmCreditLetter").hide();
//         $(".unconfirmCreditLetter").hide();
//         $(".withdraw").hide();
//         $(".0").show();
//         $(".1").hide();
//         $(".2").hide();
//     }
//     else if (resp.result == "Error: 10003"){
//         alert("该订单已经完成 或者 该订单已经发货！");
//         $(".show_human_detail").hide();
//         $(".no_address").show();
//         $(".loading_div").hide();
//         $(".input_clid").hide();
//         $(".confirmCreditLetter").hide();
//         $(".unconfirmCreditLetter").hide();
//         $(".withdraw").hide();
//         $(".0").show();
//         $(".1").hide();
//         $(".2").hide();
//     }
//     else{
//         alert("操作完成！");
//     }
// }

function Listener(resp) {
    console.log("监听");
    if (resp == "Error: Transaction rejected by user"){
      console.log(resp);
          alert("取消！");
          return false;
      }else{
          console.log(resp);
          alert("已提交区块链网络，请等待写入区块链！");
          checkPayStatus(resp.txhash);
      }
}
  
  
  
function checkPayStatus(txhash) {
      console.log("checkpaystatas "+txhash);
  
      // $(".add_human_detail").hide();
      // $(".show_human_detail").hide();
      // $(".loading_div").show();
      var timerId = setInterval(function(){
          nasApi.getTransactionReceipt({
              hash:txhash
          }).then(function(receipt){
              console.log("checkPayStatus");
              if(receipt.status == 1){
                  clearInterval(timerId);
                  var res = receipt.execute_result;
                  console.log("test success return="+res);
  
  
                  //getAccount();
  
              }else if(receipt.status == 0){
                  clearInterval(timerId);
                  console.log("test fail err="+receipt.execute_error);
                  alert("失败，请再次尝试！");
  
                  //getAccount();
              }
          }).catch(function(err){
              console.log("test error");
          });
      },3*1000);
  }

function getAccountListener(resp) {
    
    
    if (resp.result == "Error: 10001"){

        $(".show_human_detail").hide();
        $(".no_address").show();
        $(".loading_div").hide();
        $(".input_clid").hide();
        
    }else{
        var res = JSON.parse(resp.result);

        $("#span_code").text(res.code);
        $("#span_date").text(res.date);
        $("#span_createddate").text(res.createddate);
        $("#span_expirationdate").text(res.expirationdate);
        $("#span_amount").text(res.amount);
        $("#span_inname").text(res.inname);
        $("#span_inaddress").text(res.inaddress);
        $("#span_innasaddress").text(res.innasaddress);
        $("#span_outname").text(res.outname);
        $("#span_outaddress").text(res.outaddress);
        $("#span_outnasaddress").text(res.outnasaddress);
        $("#span_cargoname").text(res.cargoname);
        $("#span_cargoquality").text(res.cargoquality);
        $("#span_cargocount").text(res.cargocount);
        $("#span_cargoprice").text(res.cargoprice);
        $("#span_cargotrans").text(res.cargotrans);

        //$("#span_flag").text(res.flag);
        var flag = res.flag
        $("#span_cargolimitdate").text(res.cargolimitdate);
        $("#span_cargoshipment").text(res.cargoshipment);
        $("#span_cargodestination").text(res.cargodestination);

        $(".show_human_detail").show();
        $(".no_address").hide();
        $(".loading_div").hide();
        $(".input_clid").hide();

        if(flag == 0){//刚建立的订单，不能进行任何操作，只能去发货界面
            $(".confirmCreditLetter").hide();
            $(".unconfirmCreditLetter").hide();
            $(".withdraw").hide();
            $(".0").show();
            $(".1").hide();
            $(".2").hide();
        }
        else if(flag == 1){//已完成订单，可以进行收货，拒绝收货和撤单操作
            $(".0").hide();
            $(".1").show();
            $(".2").hide();
        }
        else if(flag == 2){//已完成订单，不能进行任何操作
            $(".confirmCreditLetter").hide();
            $(".unconfirmCreditLetter").hide();
            $(".withdraw").hide();
            $(".0").hide();
            $(".1").hide();
            $(".2").show();
        }
    }

}

