$.ajaxSetup({
    beforeSend: function (xhr) {
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType("application/json");
        }
    }
});

$.getJSON("config.json")
    .done(function (config) {

        const BOT_URL = config.telegram_api_url + config.bot_token;

        function sendMessage(message) {

            var httpRequest;

            httpRequest = new XMLHttpRequest();

            if (!httpRequest) {
                alert("Giving up :( Cannot create an XMLHTTP instance");
                return false;
            }
            httpRequest.onreadystatechange = alertContents;
            httpRequest.open("GET", BOT_URL + "/sendMessage?chat_id=" + config.chat_id + "&text=" + message);
            httpRequest.send();

            function alertContents() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        $("#requestResponse").text(httpRequest.responseText);
                    } else {
                        alert("There was a problem with the request.");
                    }
                }
            }

        }

        function transferToBot(event) {

            event.preventDefault();

            let msg = document.getElementById("textMessage").value;

            sendMessage(msg);

        }

        let form = document.getElementById("myForm");
        function handleForm(event) { event.preventDefault(); }
        form.addEventListener("submit", transferToBot);


        function prettify(message) {

            let sender = {

                fn: message.from.first_name,
                ln: message.from.last_name

            }

            let date = message.date;
            let text = message.text;

            return date + " " + sender.fn + " " + sender.ln + " : " + text;

        }

        async function getUpdate() {

            try {

                let data = await $.get(BOT_URL + "/getUpdates");
                return data.result;

            }
            catch (e) {

                console.log(e);
                alert("error, see console");

            }

        }


        async function pollUpdates(interval) {

            let results = await getUpdate();

            for (let result of results) {

                let pretty = prettify(result.message);

                console.log(pretty);

            }

            // setTimeout(() => pollUpdates(interval), interval * 1000);

        }

        pollUpdates(8);

    });