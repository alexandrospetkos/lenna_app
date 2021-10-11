var conversation_id = null;

/*
	EVENT HANDLERS
*/

function init_conversation() {
	if (!ongoing_request()) {
		ongoing_request(true);
		appendMessage("system", typing_dots);
		
		action = async () => {
			const request = await fetch('http://api.lenna.eu.ngrok.io/conv_create?key='+private_key);
			const response = await request.json();
		
			conversation_id = response["CONVERSATION_ID"];
			
			replaceMessage(document.getElementsByClassName("typing-block")[0].parentNode, response["RESPONSE"]);
			ongoing_request(false);
		}
		action().catch(() => {
			replaceMessage(document.getElementsByClassName("typing-block")[0].parentNode, "There was a problem on my end, try again in a little bit.");
		})
	}
}

function event_input() {
	if (!ongoing_request()) {
		ongoing_request(true);
		
		message = document.getElementById("user-input").value;
		if(message.trim() == '') { return false; }
		document.getElementById("user-input").value = null;

		appendMessage("user", message);
		appendMessage("system", typing_dots);
		
		action = async () => {
			const request = await fetch("http://api.lenna.eu.ngrok.io/conv_append?key=" + private_key + "&conv_id=" + conversation_id + "&kbase=default&utterance=" + message);
			const response = await request.json();
			
			replaceMessage(document.getElementsByClassName("typing-block")[0].parentNode, response["RESPONSE"]);
			ongoing_request(false);
		}
		action().catch(() => {
			replaceMessage(document.getElementsByClassName("typing-block")[0].parentNode, "There was a problem on my end, try again in a little bit.");
		})
	}
}

/*
	CONVERSATION CONTAINER FUNCTIONS
*/

var typing_dots = '<div class="typing-block"> <div class="typing-dot"></div> <div class="typing-dot"></div> <div class="typing-dot"></div> </div>';

function appendMessage(type, message) {
	conversation_container = document.getElementById("conversation-container")
	if(type == "system") {
		conversation_container.innerHTML += '<div type="system" class="text-response-wrapper"> <div class="text-response">' + message + '</div></div>';
	} else if(type = "user") {
		conversation_container.innerHTML += '<div type="user" class="text-response-wrapper"> <div class="text-response">' + message + '</div></div>';
	}
	conversation_container.scrollTop = conversation_container.scrollHeight;
};
 
function replaceMessage(element, message) {
	element.innerHTML = message;
}

/*
	STATE FUNCTIONS
*/

var global_ongoing_request = false;
function ongoing_request(state = null) {
	if (state == null) {
		return global_ongoing_request;
	} else {
		global_ongoing_request = state;
	}

	if (state == true) {
		document.getElementById("send-icon-path").setAttribute("fill", "#d7d7d7"); 
	} else if (state == false) {
		document.getElementById("send-icon-path").setAttribute("fill", "#006cff"); 
	}
}

/*
	HELPER FUNCTIONS
*/

function hide_element(element) {
	document.getElementById(element).style.display = "none";
}

function show_element(element) {
	document.getElementById(element).style.display = "flex";
}