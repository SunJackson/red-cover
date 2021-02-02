from flask import Flask, request, make_response
import requests
import hashlib
import xml.etree.ElementTree as ET
import time

app = Flask(__name__)


@app.route("/wechat-gzh", methods=["POST", "GET"])
def wechat_robot():
    if request.method == "GET":  # 判断请求方式是GET请求
        print(request.args)
        my_signature = request.args.get('signature')  # 获取携带的signature参数
        my_timestamp = request.args.get('timestamp')  # 获取携带的timestamp参数
        my_nonce = request.args.get('nonce')  # 获取携带的nonce参数
        my_echostr = request.args.get('echostr')  # 获取携带的echostr参数
        print(my_signature)
        token = 'yuanqiyuanluo'  # 一定要跟刚刚填写的token一致
        print(my_signature, my_timestamp, my_nonce, my_echostr)
        # 进行字典排序
        data = [token, my_timestamp, my_nonce]
        data.sort()
        # 拼接成字符串
        temp = ''.join(data)

        # 进行sha1加密
        mysignature = hashlib.sha1(temp.encode()).hexdigest()
        print(my_signature, mysignature)
        # 加密后的字符串可与signature对比，标识该请求来源于微信
        if my_signature == mysignature:
            return make_response(my_echostr)
    else:
        print('微信接口 post')
        # 这里是根据公众号中收到的消息（/关键词）去返回相关的资源信息，使用文本消息接口
        _str = request.stream.read()
        print(_str.decode('utf8'))
        if not _str:
            return '请求参数为空'
        str_xml = ET.fromstring(_str.decode('utf8'))
        fromUser = str_xml.find('ToUserName').text
        toUser = str_xml.find('FromUserName').text
        msgType = str_xml.find("MsgType").text
        createTime = str_xml.find("CreateTime").text
        content = str_xml.find("Content").text
        contents = [i.strip() for i in content.strip().split('\n')]
        print(toUser, fromUser, msgType, createTime, content)
        print(len(contents))
        if len(contents) >= 2 and '元气封面' in content:
            record_res = requests.get(
                'https://xxxxxxxxxxxxx.bspapp.com/http/api/wechat/search?_id={}'.format(
                    ''.join(contents[-2:])))
            if record_res.status_code == 200:
                res_json = record_res.json().get("data", [])
                if len(res_json) > 0:
                    if res_json[0].get('status', 1) == 0:
                        red_cover_code_res = requests.get(
                            'https://xxxxxxxxxxxxxxxxxxxx.bspapp.com/http/api/wechat/getcode?coverid={}&_id={}'.format(
                                contents[-2], ''.join(contents[-2:])))
                        redCoverValue = red_cover_code_res.json().get('data', {}).get('redCoverValue', "")
                        if redCoverValue:
                            return reply_text(toUser, fromUser, "领取成功\n点击下面链接领取\nhttps://support.weixin.qq.com/cgi-bin/mmsupport-bin/showredpacket?receiveuri={}&check_type=2".format(redCoverValue))
                        else:
                            return reply_text(toUser, fromUser, '库存不足啦，耐心等待客服补货，任务完成都可以领取，请不要着急，补货后重新发送领取码领取哦。')
                    else:
                        return reply_text(toUser, fromUser, '小伙伴，这个封面你已经领过啦，我们还有别的好多好看的款式，想要就快去完成任务来领呀，等你哦')
                else:
                    return reply_text(toUser, fromUser, '未完成任务，请完成任务后按照小程序指示再来领取哦')
        else:
            reply_map = {
                "红包,封面": "搜索小程序【元气封面】第一时间获取封面信息，领取更多封面",
                "外卖,饿了么,美团": "点击下方菜单进入【惠吃会喝】，领取外卖红包",
            }
            for reply_key in reply_map:
                for key in reply_key.split(','):
                    if key in content:
                        return reply_text(toUser, fromUser, reply_map[reply_key])
            return reply_text(toUser, fromUser, '功能开发中，如有其他需求，+wx【sunjiajis】')


def reply_text(to_user, from_user, content):
    """
    以文本类型的方式回复请求
    """
    return """<xml>
      <ToUserName><![CDATA[{}]]></ToUserName>
      <FromUserName><![CDATA[{}]]></FromUserName>
      <CreateTime>{}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[{}]]></Content>
    </xml>
    """.format(to_user, from_user, int(time.time() * 1000), content)


if __name__ == '__main__':
    app.run(debug=True)
