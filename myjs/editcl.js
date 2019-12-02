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

//var chainInfo = chainnetConfig["mainnet"];
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



if (typeof(webExtensionWallet) === "undefined") {

  alert("请首先安装webExtensionWallet插件");
}


// $(".add_human_detail").hide();
// $(".show_human_detail").hide();
//$(".upload_data").hide();


var dappAddress = chainInfo.contractAddress;

// function getAccount(){
//     var to = dappAddress;
//     var value = "0";
//     var callFunction = "searchRecordByAddress";
//     var callArgs = "";
//     nebPay.simulateCall(to, value, callFunction, callArgs, {
//         listener: getAccountListener
//     });
// }

// function getAccountListener(resp) {
//     var res = JSON.parse(resp.result);

//     // if (res != null){
//     //     $("#span_addr").text(res.createraddress);
//     //     $("#span_certificateid").text(res.certificateid);
//     //     $("#span_name").text(res.name);
//     //     $("#span_gender").text(res.gender);
//     //     $("#span_nation").text(res.nation);
//     //     $("#span_country").text(res.country);
//     //     $("#span_dateofbirth").text(res.dateofbirth);
//     //     $("#span_health").text(res.health);
//     //     $("#span_weight").text(res.weight);
//     //     $("#span_height").text(res.height);
//     //     $("#span_fname").text(res.fname);
//     //     $("#span_mname").text(res.mname);
//     //     $("#span_homelandofbirth").text(res.homelandofbirth);
//     //     $("#span_placeofbirth").text(res.placeofbirth);
//     //     $("#span_deliverymechanism").text(res.deliverymechanism);
//     //     $("#span_dateofissue").text(res.dateofissue);

//     //     $(".show_human_detail").show();
//     //     $(".add_human_detail").hide();
//     //     $(".loading_div").hide();

//     // }else{
//     //     $(".show_human_detail").hide();
//     //     $(".add_human_detail").show();
//     //     $(".loading_div").hide();
//     // }

//     $(".show_human_detail").hide();
//         $(".add_human_detail").show();
//         $(".loading_div").hide();
// }

//初始化
$("#fahuo").click(function() {
    var code = $("#code").val();
    var cargolimitdate = $("#cargolimitdate").val();
    var cargoshipment = $("#cargoshipment").val();
    var cargodestination = $("#cargodestination").val();


    if (code == ""||cargolimitdate == ""||cargoshipment == ""||cargodestination == "") {
        alert("请完整填写表单！");
        return false;
    }
    if (cargolimitdate.length > 20||cargoshipment.length > 20||cargodestination.length > 20){
        alert("过长！");
        return false;
    }

    else{
        fahuo(code,cargolimitdate,cargoshipment,cargodestination);
    }
})

function fahuo (code,cargolimitdate,cargoshipment,cargodestination){
    var to = dappAddress;
    var value = "0";
    var callFunction = "editCreditLetter";

    var callArgs = "[\""+code+"\",\""+cargolimitdate+"\",\""+cargoshipment+"\",\""+cargodestination+"\"]";

    nebPay.call(to, value, callFunction, callArgs, {
      listener: fahuoListener
  });
}


function fahuoListener(resp) {
  console.log("监听");
  if (resp == "Error: Transaction rejected by user"){
    console.log(resp);
        alert("取消！");
        return false;
    }
    else if (resp.result == "Error: 10001"){
        alert("没有当前ID的信用证！");
    }
    else if (resp.result == "Error: 10002"){
        alert("出口人账户不正确，请更换账户");
    }
    else if (resp.result == "Error: 10003"){
        alert("该订单已经完成 或者 该订单已经发货！");
    }
    else{
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


                

            }else if(receipt.status == 0){
                clearInterval(timerId);
                console.log("test fail err="+receipt.execute_error);
                alert("失败，请再次尝试！");

                
            }
        }).catch(function(err){
            console.log("test error");
        });
    },3*1000);
}
