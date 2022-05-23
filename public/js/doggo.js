function changeBack(){

    var button = document.getElementsByClassName("pic")[0];
    var changeText = document.getElementsByClassName("butt")[0];

    if(button.classList.contains("changeColor"))
    {
        button.classList.remove("changeColor");
        changeText.innerHTML = "Click Me!"
        
    }
    else
    {
        button.classList.add("changeColor");
        changeText.innerHTML = "HIDE DoGGo!"
    }

}