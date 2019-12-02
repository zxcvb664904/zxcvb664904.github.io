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
$("#add_human_detail").click(function() {
    var inname = $("#inname").val();
    var inaddress = $("#inaddress").val();
    var amount = $("#amount").val();
    var outname = $("#outname").val();
    var outaddress = $("#outaddress").val();
    var outnasaddress = $("#outnasaddress").val();
    var cargoname = $("#cargoname").val();
    var cargoquality = $("#cargoquality").val();
    var cargocount = $("#cargocount").val();
    var cargoprice = $("#cargoprice").val();
    var cargotrans = $("#cargotrans").val();
    var date = $("#date").val();
    var expirationdate = $("#expirationdate").val();
    // var dateofissue = $("#dateofissue").val();


    if (inname == ""||inaddress == ""||amount == ""||outname == ""
        ||outaddress == ""||outnasaddress == ""||cargoname == ""||cargoquality == ""||cargocount == ""
        ||cargoprice == ""||cargotrans == ""||date == ""||expirationdate == "") {
        alert("请完整填写表单！");
        return false;
    }
    if (inname.length > 20||inaddress.length > 20||amount.length > 20||outname.length > 20||outaddress.length > 20||cargoname.length > 20
        ||cargoquality.length > 20||cargocount.length > 20||cargoprice.length > 20||cargotrans.length > 20||date.length > 20||expirationdate.length > 20){
        alert("名称过长！");
        return false;
    }
    if (isNaN(amount)==true){
        alert("请正确输入发送星云币金额！");
        return false;
    }

    else{
        startadd_human_detail(inname,inaddress,amount,outname,outaddress,outnasaddress,cargoname,cargoquality
            ,cargocount,cargoprice,cargotrans,date,expirationdate);
    }
})

function startadd_human_detail (inname,inaddress,amount,outname,outaddress,outnasaddress,cargoname,cargoquality,cargocount,cargoprice,cargotrans,date,expirationdate){
    var to = dappAddress;
    var value = amount;
    var callFunction = "initCreditLetter";

    var sha1 = hex_sha1(inname + "-" + inaddress + "-" + amount + "-" + outname + "-" + outaddress + "-" + outnasaddress + "-" + cargoname + "-" + cargoquality + "-" + cargocount + "-" + cargoprice + "-" + cargotrans + "-" + date + "-" + expirationdate)

    //var callArgs = "[\""+name+"\",\""+gender+"\",\""+dateofbirth+"\",\""+homelandofbirth+"\",\""+health+"\","+weight+","+height+",\""+country+"\",\""+nation+"\",\""+fname+"\",\""+mname+"\",\""+placeofbirth+"\",\""+deliverymechanism+"\",\""+dateofissue+"\",\""+sha1+"\"]";

    var callArgs =
        "[{\"code\":\"" + sha1
        + "\",\"inname\":\"" + inname
        + "\",\"inaddress\":\"" + inaddress
        + "\",\"amount\":\"" + amount
        + "\",\"outname\":\"" + outname
        + "\",\"outaddress\":\"" + outaddress
        + "\",\"outnasaddress\":\"" + outnasaddress
        + "\",\"cargoname\":\"" + cargoname
        + "\",\"cargoquality\":\"" + cargoquality
        + "\",\"cargocount\":\"" + cargocount
        + "\",\"cargoprice\":\"" + cargoprice
        + "\",\"cargotrans\":\"" + cargotrans
        + "\",\"date\":\"" + date
        + "\",\"expirationdate\":\"" + expirationdate
        + "\"}]";

        alert("请复制或者牢记生成的唯一ID，否则信用证可能丢失！"+sha1);
        alert("请复制或者牢记生成的唯一ID，否则信用证可能丢失！"+sha1);

    nebPay.call(to, value, callFunction, callArgs, {
      listener: startadd_human_detailAccountListener
  });
}


function startadd_human_detailAccountListener(resp) {
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
