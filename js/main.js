// 拿到ul
$mainList = $(".mainList");
// 查询ul下所有含有li并且li有.last类名的li元素
const $lastLi = $mainList.find("li.last");
// 获取本地存储里的值
const slocal = localStorage.getItem("slocal");
// 因为本地存储的值是以json字符串存储，我需要读取它的键值对所以要对象形式
const slocalObject = JSON.parse(slocal);

// 创建一个存储键值对的量 用于给遍历函数获取数据并展示
// 刚开始slocalObject是没有值的，所以hash就是||后面的那数组，然后执行了下面的onbeforeunload函数，所以已经把这数组
// 存到了本地存储中，之后slocalObject有值了，就会一直使用slocalObject的值，||后面就不需要了，即a||b a有值，b就不要了
const hashMap = slocalObject || [{
        logo: "b",
        url: "https://www.bilibili.com",
    },
    {
        logo: "t",
        url: "https://www.taobao.com"
    }
];

// 简化展示的链接长度，仅在展示时改变，其本身url不变
const simplifyUrl = (url) => {
    return url.replace("https://", "")
        .replace("http://", "")
        .replace("www.", "")
        // 对于 /. 的替换
        .replace(/\/.*/, "");
}

// 遍历hashMap里的数据
const render = () => {
    // 删除ul的li里边不含有.last的其他ul，为了初始化数据
    $mainList.find("li:not(.last)").remove();
    hashMap.forEach((item, index) => {
        // 1. 把遍历的数据插入到$lastLi之前
        const $li = $(`<li>
        <div class="site">
          <div class="tip">按下${item.logo}键可跳转</div>
          <div class="logo">${item.logo}</div>
          <div class="link">${simplifyUrl(item.url)}</div>
          <div class="close">
            <svg class="icon">
              <use xlink:href="#icon-close"></use>
            </svg>
          </div>
        </div>
      </li>`).insertBefore($lastLi);
        //   li被点击时，打开对应的url
        $li.on("click", () => {
            window.open(item.url)
        })
        $li.on("click", ".close", (e) => {
            // 阻止冒泡，防止触发click操作，因为.close类的父级是li
            e.stopPropagation();
            // 删除对应索引的hashMap
            hashMap.splice(index, 1);
            // 重新遍历，初始化
            render();
        });
    });
};

//重新遍历，初始化
render();

// 点击添加按钮的时候触发
$(".addButton").on("click", () => {
    let url = window.prompt("请输入要添加的网址");
    // 判断字符串里是否含有http， indexOf返回值为-1就是没有匹配到
    // 如果要检索的字符串值没有出现，则该方法返回 -1。查找到的话返回字符串所在的位置
    if (url && url.indexOf("http") !== 0) {
        // 给加上前缀
        url = "https://" + url;
        // 存入hashMap数组中
        hashMap.push({
            // 简化后的url的第一个字符并且转化成小写
            logo: simplifyUrl(url)[0].toLowerCase(),
            url: url
        });
        render();

        // 如果检索的字符串出现在0的位置，则直接push，不用前缀
    } else if (url && url.indexOf("http") == 0) {
        console.log(url);
        hashMap.push({
            // 简化后的url的第一个字符并且转化成小写
            logo: simplifyUrl(url)[0].toLowerCase(),
            url: url
        });
        render();
    }
});

// 关闭页面或者刷新页面时，启动这个函数，把当前hashMap的内容放进本地存储
// 因为本地存储存储字符串，所以必须转化成字符串存入
window.onbeforeunload = () => {
    const string = JSON.stringify(hashMap);
    localStorage.setItem("slocal", string);
};

// 当有按键被按下后触发
$(document).on("keypress", (e) => {
    // 对象解构 把右边得到的事件结果对象的key属性解构出来使用，相当于我要什么就解构什么
    const { key } = e;
    for (let i = 0; i < hashMap.length; i++) {
        if (hashMap[i].logo.toLocaleLowerCase() == key) {
            window.open(hashMap[i].url);
            break;
        }
    }
});