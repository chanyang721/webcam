// const { default: axios } = require("axios");

let enhancer = null;
(
    async () => {
        enhancer = await Dynamsoft.DCE.CameraEnhancer.createInstance();
        console.log(enhancer)
        document.getElementById("enhancerUIContainer").appendChild(enhancer.getUIElement());
        await enhancer.open(true);
    }
)();

function captureCamera () {
    document.getElementById('capture').onclick = () => {
        if (enhancer) {
            let frame = enhancer.getFrame();
            photoZone.append(frame.canvas)
        }
    };
}


function sendImage () {
    document.getElementById('sendPhoto').onclick = () => {
        var canvas = document.createElement("canvas"); // 엘리먼트 가져오기 
        const dataURL = canvas.toDataURL("image/png"); // 이미지 가져오기
        const decodeImg = atob(dataURL.split(',')[1]);


        let array = [];
        for (let i = 0; i < decodeImg.length; i++) {
            array.push(decodeImg.charCodeAt(i));
        }
    
        const file = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
        const fileName = 'canvas_img_' + new Date().getMilliseconds() + '.jpg';
        let formData = new FormData();
        formData.append('file', file, fileName);

        dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        console.log(dataURL)

        // 요청
        fetch('https://tiqr86ropk.execute-api.ap-northeast-2.amazonaws.com/cors_test/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: JSON.stringify(dataURL) || null,
            })
            .then((response) => response.json())
            .then((data) => {
                alert("Successfully sent the image");
                console.log(data)
            })
            .catch((error) => {
                alert("Failed to send the image");
                console.error('실패:', error);
            });
    }
}
