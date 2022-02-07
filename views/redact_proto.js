const redact_proto = (action, sub)=>{
    let s = `<!-- redact_proto.js --><br><hr><button onclick="redaktiert(this);">редактировать</button><hr>
<form id="rForm" name="rform" method="post" action="${action}">
<textarea id="rText" name="rtext"></textarea><br>
<input type="hidden" name="sub" value="${sub}">
<input type="submit" value="Сохранить">&nbsp;&nbsp;<input type="reset" value="Oтменить">
</form>`;
    return s;
}
module.exports = { redact_proto }