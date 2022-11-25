let mouseOver = false;
let selectedIdentity = null;
let selectedIdentityType = null;
let selectedIdentityCost = null;
let selectedJob = null;
let selectedJobId = null;

Open = function() {
    $(".container").fadeIn(150);
}

Close = function() {
    $(".container").fadeOut(150, function(){
        ResetPages();
    });
    $.post('https://qb-cityhall/close');
    $(selectedJob).removeClass("job-selected");
    $(selectedIdentity).removeClass("job-selected");
}

SetJobs = function(jobs) {
    $.each(jobs, (job, name) => {
        let html = `<div class="job-page-block" data-job="${job}"><p>${name}</p></div>`;
        $('.job-page-blocks').append(html);
    })
}

ResetPages = function() {
    $(".cityhall-option-blocks").show();
    $(".close-menu").fadeIn(100);
    $(".back-to-main").fadeOut(100);
    $(".apply-job-button").fadeOut(100);
    $(".request-identity-button").fadeOut(100);
    $(".cityhall-identity-page").hide();
    $(".cityhall-job-page").hide();
}

$(document).ready(function(){
    window.addEventListener('message', function(event) {
        switch(event.data.action) {
            case "open":
                Open();
                break;
            case "close":
                Close();
                break;
            case "setJobs":
                SetJobs(event.data.jobs);
                break;
        }
    })
});

document.onkeyup = function (event) {
    const charCode = event.key;
    if (charCode == "Escape") {
        Close();
    }
};

$('.cityhall-option-block').click(function(e){
    e.preventDefault();
    let blockPage = $(this).data('page');
    $(".close-menu").fadeOut(100);
    $(".back-to-main").fadeIn(100);
    $(".cityhall-option-blocks").fadeOut(100, () => {
        $(`.cityhall-${blockPage}-page`).fadeIn(100);
    });
    if (blockPage == "identity") {
        $(".identity-page-blocks").html("");
        $.post('https://qb-cityhall/requestLicenses', JSON.stringify({}), function(licenses){
            $.each(licenses, (i, license) => {
                let elem = `<div class="identity-page-block" data-type="${i}" data-cost="${license.cost}"><p>${license.label} | $${license.cost}</p></div>`;
                $(".identity-page-blocks").append(elem);
            });
        });
    }
});

$(document).on("click", ".identity-page-block", function(e){
    e.preventDefault();
    selectedIdentityType = $(this).data('type');
    selectedIdentityCost = $(this).data('cost');
    if (selectedIdentity == null) {
        $(this).addClass("identity-selected");
        selectedIdentity = this;
        $(".request-identity-button").fadeIn(100);
    } else if (selectedIdentity == this) {
        $(this).removeClass("identity-selected");
        selectedIdentity = null;
        $(".request-identity-button").fadeOut(100);
    } else {
        $(selectedIdentity).removeClass("identity-selected");
        $(this).addClass("identity-selected");
        selectedIdentity = this;
    }
});

$(".request-identity-button").click(function(e){
    e.preventDefault();
    $.post('https://qb-cityhall/requestId', JSON.stringify({
        type: selectedIdentityType,
        cost: selectedIdentityCost
    }))
    ShowCheckmark();
    ResetPages();
});

$(document).on("click", ".job-page-block", function(e){
    e.preventDefault();
    selectedJobId = $(this).data('job');
    if (selectedJob == null) {
        $(this).addClass("job-selected");
        selectedJob = this;
        $(".apply-job-button").fadeIn(100);
    } else if (selectedJob == this) {
        $(this).removeClass("job-selected");
        selectedJob = null;
        $(".apply-job-button").fadeOut(100);
    } else {
        $(selectedJob).removeClass("job-selected");
        $(this).addClass("job-selected");
        selectedJob = this;
    }
});

$(document).on('click', '.apply-job-button', function(e){
    e.preventDefault();
    $.post('https://qb-cityhall/applyJob', JSON.stringify(selectedJobId))
    ShowCheckmark();
    ResetPages();
});

$(document).on('click', '.back-to-main', function(e){
    e.preventDefault();
    $(selectedJob).removeClass("job-selected");
    $(selectedIdentity).removeClass("job-selected");
    ResetPages();
});

$(document).on('click','.close-menu', function(){
    $('.bottompart').fadeOut()
    setTimeout(function(){
        $('.container').css('height', '30vh');
        setTimeout(function(){
            $(".container").fadeOut(150, function(){
                ResetPages();
            });
            $(selectedJob).removeClass("job-selected");
            $(selectedIdentity).removeClass("job-selected");
        }, 180)
    }, 0)
    $.post('https://qb-cityhall/close');
})

// ShowCheckmark();

ShowCheckmark = (Timeout) => {
    $('.menu-checkmark-wrapper').show();
    $('.menu-checkmark-container').html('<div class="ui-styles-checkmark"><div class="circle"></div><svg fill="#fff" class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="3.2vh" height="3.2vh"><path d="M 28.28125 6.28125 L 11 23.5625 L 3.71875 16.28125 L 2.28125 17.71875 L 10.28125 25.71875 L 11 26.40625 L 11.71875 25.71875 L 29.71875 7.71875 Z"/></svg></div>');
    setTimeout(() => {
        $('.menu-checkmark-wrapper').fadeOut(500);
    }, Timeout != null ? Timeout : 2000);
}