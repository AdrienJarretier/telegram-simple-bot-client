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

        let last_update_id = 0;

        function appendInChat(text) {



            $("#requestResponse").append(text + '<br>');

        }

        function sendMessage(message) {

            var httpRequest;

            httpRequest = new XMLHttpRequest();

            if (!httpRequest) {
                alert("Giving up :( Cannot create an XMLHTTP instance");
                return false;
            }
            httpRequest.onreadystatechange = alertContents;

            let chat_id = config.chat_ids[1]

            let request = BOT_URL + "/sendMessage?chat_id=" + chat_id + "&text=" + message;
            httpRequest.open("GET", request);
            httpRequest.send();

            function alertContents() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status !== 200) {
                        alert("There was a problem with the request.");
                        console.error(request);
                    }
                    else {


                        appendInChat("sent to " + chat_id + " : " + message);

                    }
                }
            }

        }

        function transferToBot(event) {

            event.preventDefault();

            let msg = document.getElementById("textMessage").value;

            $("#textMessage").val('');

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

        async function getUpdate(timeout) {

            try {

                let data = await $.get(BOT_URL + "/getUpdates",
                    {
                        offset: (last_update_id + 1),
                        timeout: timeout
                    }
                );
                return data.result;

            }
            catch (e) {

                console.log(e);
                alert("error, see console");

            }

        }


        async function pollUpdates(interval) {

            console.log("polling update");

            let results = await getUpdate(interval);

            for (let result of results) {

                console.log(result);

                last_update_id = result.update_id;

                let pretty = prettify(result.message);

                appendInChat(pretty);

            }

            pollUpdates(interval);

        }

        pollUpdates(60);

    });