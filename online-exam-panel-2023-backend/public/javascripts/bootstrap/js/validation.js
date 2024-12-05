
  function validateText(id)
  {
      if ($("#"+id).val()==null||$("#"+id).val()=="")
      {
        var div=$("#"+id).closest("div");
        div.removeClass("has-success");
        $("#glycn"+id).remove();
        div.addClass("has-error has-feedback");
        div.append('<span id="glycn'+id+'" class="glyphicon glyphicon-remove form-control-feedback"></span>');
        return false;
      }
      else
      {
        var div=$("#"+id).closest("div");
        div.removeClass("has-error");
        div.addClass("has-success has-feedback");
        $("#glycn"+id).remove();
        div.append('<span id="glycn'+id+'" class="glyphicon glyphicon-ok form-control-feedback"></span>');
        return true;
      }
  }

  $(document).ready(
    function()
    {
      $("#myButton").click(function()
      {
        if (!validateText("cName1")) 
        {
          return false;
        }
        if (!validateText("cEmail1")) 
        {
          return false;
        }
        if (!validateText("cMobi1")) 
        {
          return false;
        }      
        if (!validateText("cSubject1")) 
        {
          return false;
        }
        if (!validateText("cMsg1")) 
        {
          return false;
        }
      
        $("form#contactform").submit();
      });
  }
);

