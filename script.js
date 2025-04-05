$(document).ready(function() {
    let isDragModeEnabled = false;
    let lastSidebarMoved = null;

    $("#accordion").accordion({
        animate: {
            duration: 800,
            easing: "easeOutBounce"
        }
    });

    $("#tabs").tabs({
        show: { effect: "fadeIn", duration: 400 }
    });

    $("#tabs ul li").on("mouseover", function() {
        var index = $(this).index();
        $("#tabs").tabs("option", "active", index);
    });

    $("#addTabModal").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Dodaj zakładkę": function() {
                var tabTitle = $("#tab-title").val().trim();
                var tabContent = $("#tab-content").val().trim();

                if (tabTitle && tabContent) {
                    var tabId = "tabs-" + ($("#tabs ul li").length + 1);
                    $("#tabs ul").append(`<li><a href="#${tabId}">${tabTitle}</a></li>`);
                    $("#tabs").append(`<div id="${tabId}"><p>${tabContent}</p></div>`);
                    $("#tabs").tabs("refresh");

                    $("#tabs ul li").off("mouseover").on("mouseover", function() {
                        var index = $(this).index();
                        $("#tabs").tabs("option", "active", index);
                    });

                    $(this).dialog("close");
                    $("#addTabForm")[0].reset();
                } else {
                    alert("Proszę wypełnić oba pola!");
                }
            },
            "Anuluj": function() {
                $(this).dialog("close");
            }
        }
    });

    $("#addTabBtn").click(function() {
        $("#addTabModal").dialog("open");
    });

    $("#addModal").dialog({
        autoOpen: false,
        modal: true,
        show: { effect: "slideDown", duration: 400 },
        hide: { effect: "slideUp", duration: 400 },
        buttons: {
            "Dodaj": function() {
                var isValid = true;
                var name = $("#name").val().trim();
                var age = $("#age").val().trim();
                var job = $("#job-selection .selected").text().trim();

                if (name.length < 2) {
                    $("#name").addClass("error").removeClass("valid");
                    isValid = false;
                } else {
                    $("#name").addClass("valid").removeClass("error");
                }

                if (!/^\d+$/.test(age) || age < 18 || age > 99) {
                    $("#age").addClass("error").removeClass("valid");
                    isValid = false;
                } else {
                    $("#age").addClass("valid").removeClass("error");
                }

                if (job === "") {
                    $("#job-selection").addClass("error").removeClass("valid");
                    isValid = false;
                } else {
                    $("#job-selection").addClass("valid").removeClass("error");
                }

                if (isValid) {
                    var newRow = `<tr>
                        <td>${name}</td>
                        <td>${age}</td>
                        <td>${job}</td>
                        <td>
                            <button class="deletePersonBtn">Usuń osobę</button>
                            <button class="hideRowBtn">Ukryj</button>
                        </td>
                    </tr>`;
                    $("#data-table").append(newRow);
                    updateRowColors();
                    $(this).dialog("close");
                    resetForm();
                } else {
                    $(this).parent().addClass("dialog-error").effect("shake", { times: 3 }, 500);
                }
            },
            "Anuluj": function() {
                $(this).dialog("close");
                resetForm();
            }
        }
    });

    function resetForm() {
        $("#addForm")[0].reset();
        $(".job-option").removeClass("selected");
        $(".error, .valid").removeClass("error valid");
        $(".dialog-error").removeClass("dialog-error");
    }

    $("#addNewBtn").click(function() {
        $("#addModal").dialog("open");
    });

    $(".job-option").click(function() {
        $(".job-option").removeClass("selected");
        $(this).addClass("selected");
        $("#job-selection").removeClass("error").addClass("valid");
    });

    $(document).on("click", ".deletePersonBtn", function() {
        $(this).closest("tr").fadeOut(400, function() {
            $(this).remove();
            updateRowColors();
        });
    });

    $(document).on("click", ".hideRowBtn", function() {
        $(this).closest("tr").fadeOut(400);
    });

    $("#temperature-slider").slider({
        min: 15,
        max: 25,
        value: 20,
        slide: function(event, ui) {
            $("#temperature-value").text(ui.value);
            $(this).css("background", `linear-gradient(to right, blue, red ${((ui.value - 15) / 10) * 100}%, red)`);
        }
    });

    $("#humidity-slider").slider({
        min: 0,
        max: 100,
        value: 50,
        slide: function(event, ui) {
            $("#humidity-value").text(ui.value);
            $(this).css("background", `linear-gradient(to right, gray, blue ${ui.value}%, blue)`);
        }
    });

    $("#air-quality-slider").slider({
        min: 0,
        max: 500,
        value: 100,
        slide: function(event, ui) {
            $("#air-quality-value").text(ui.value);
            var color = getAirQualityColor(ui.value);
            $(this).css("background", `linear-gradient(to right, ${color.start}, ${color.end} ${ui.value / 5}%)`);
        }
    });

    $("#tabs ul").sortable({
        axis: "x",
        stop: function() {
            $("#tabs").tabs("refresh");
        }
    });

    $("#toggle-drag-mode").click(function() {
        isDragModeEnabled = !isDragModeEnabled;
        
        if (isDragModeEnabled) {
            $(this).text("❌ Wyłącz przesuwanie")
                  .css({
                      'background-color': '#ff4444',
                      'transform': 'scale(1.1)'
                  });
            enableDragging();
        } else {
            $(this).text("🔄 Włącz przesuwanie")
                  .css({
                      'background-color': '#0c6eee',
                      'transform': 'scale(1.0)'
                  });
            disableDragging();
        }
    });

    function enableDragging() {
        try {
            $(".left-sidebar, .right-sidebar").sortable({
                connectWith: ".left-sidebar, .right-sidebar",
                items: ".module",
                placeholder: "sortable-placeholder",
                tolerance: "pointer",
                cursor: "move",
                opacity: 0.7,
                start: function(event, ui) {
                    $(ui.item).addClass('dragging');
                    
                    $(".left-sidebar, .right-sidebar").addClass('drop-highlight');
                    
                    $('.content, .header, .menu, .footer').addClass('non-droppable');
    
                    $('.non-droppable').on('mouseenter', function() {
                        $(this).addClass('hover');
                    }).on('mouseleave', function() {
                        $(this).removeClass('hover');
                    });
                },
                stop: function(event, ui) {
                    $(ui.item).removeClass('dragging');
                    $('.drop-highlight').removeClass('drop-highlight');
                    $('.non-droppable').removeClass('non-droppable hover');
                    
                    $('.non-droppable').off('mouseenter mouseleave');
                },
                receive: function(event, ui) {
                    $(ui.item).effect("highlight", {}, 800);
                }
            }).disableSelection();
    
        } catch (error) {
            console.error("Error enabling drag and drop:", error);
        }
    }
    

    function disableDragging() {
        try {
            $(".left-sidebar, .right-sidebar").sortable("destroy");
            lastSidebarMoved = null;
        } catch (error) {
            console.error("Error disabling drag and drop:", error);
        }
    }

    function updateRowColors() {
        if ($("#toggleRowColor").is(":checked")) {
            $("#data-table tr:even").addClass("highlight");
        } else {
            $("#data-table tr:even").removeClass("highlight");
        }
    }

    $("#toggleRowColor").change(updateRowColors);


    $("#calendar").datepicker({
        showAnim: "slideDown",
        dateFormat: "dd-mm-yy",
        firstDay: 1,
        dayNamesMin: ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"],
        monthNames: [
            "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
            "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
        ],
        monthNamesShort: [
            "Sty", "Lut", "Mar", "Kwi", "Maj", "Cze",
            "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"
        ],
        prevText: "Poprzedni",
        nextText: "Następny",
        closeText: "Zamknij",
        currentText: "Dziś",
        weekHeader: "Tydz",
        onSelect: function(dateText) {
            alert("Wybrano datę: " + dateText);
        }
    });

    let isContentDraggingEnabled = false;

    function enableContentDragging() {
        try {
            $(".content").sortable({
                items: ".content-module",
                placeholder: "content-placeholder",
                containment: ".content",
                tolerance: "pointer",
                cursor: "move",
                opacity: 0.7,
                start: function(event, ui) {
                    $(ui.item).addClass('dragging');
                    $('.header, .menu, .left-sidebar, .right-sidebar, .footer').addClass('non-droppable');
                },
                stop: function(event, ui) {
                    $(ui.item).removeClass('dragging');
                    $('.non-droppable').removeClass('non-droppable');
                }
            }).disableSelection();
            
            console.log("Włączono przeciąganie modułów");
        } catch (error) {
            console.error("Błąd podczas włączania przeciągania modułów:", error);
        }
    }

    function disableContentDragging() {
        try {
            $(".content").sortable("destroy");
        } catch (error) {
            console.error("Błąd podczas wyłączania przeciągania modułów:", error);
        }
    }

    $("#toggle-content-drag").click(function() {
        isContentDraggingEnabled = !isContentDraggingEnabled;
        
        if (isContentDraggingEnabled) {
            $(this).text("❌ Wyłącz przesuwanie modułów")
                  .css({
                      'background-color': '#ff4444',
                      'transform': 'scale(1.1)'
                  });
            enableContentDragging();
        } else {
            $(this).text("🔄 Włącz przesuwanie modułów")
                  .css({
                      'background-color': '#0c6eee',
                      'transform': 'scale(1.0)'
                  });
            disableContentDragging();
        }
    });

    setTimeout(() => {
        try {
            const tempCtx = document.getElementById('tempChart');
            const humidityCtx = document.getElementById('humidityChart');

            if (tempCtx && humidityCtx) {
                new Chart(tempCtx, {
                    type: 'line',
                    data: {
                        labels: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec'],
                        datasets: [{
                            label: 'Temperatura (°C)',
                            data: [15, 18, 20, 22, 25, 28],
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            tension: 0.3
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Średnia temperatura w miesiącach'
                            }
                        }
                    }
                });

                new Chart(humidityCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt'],
                        datasets: [{
                            label: 'Wilgotność (%)',
                            data: [45, 52, 48, 55, 50],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgb(54, 162, 235)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Wilgotność w ciągu tygodnia'
                            }
                        }
                    }
                });

                console.log('Wykresy zostały zainicjalizowane');
            } else {
                console.error('Nie znaleziono elementów canvas dla wykresów');
            }
        } catch (error) {
            console.error('Błąd podczas inicjalizacji wykresów:', error);
        }
    }, 100);

    $(document).on('click', '.remove-item', function() {
        const item = $(this).closest('.removable-item');
        
        item.animate({
            opacity: 0,
            height: 0,
            margin: 0,
            padding: 0
        }, {
            duration: 800,
            easing: 'easeOutBounce',
            complete: function() {
                $(this).animate({
                    width: 0
                }, {
                    duration: 400,
                    complete: function() {
                        $(this).remove();
                    }
                });
            }
        });
    });
});



// Funkcja zwracająca kolor dla jakości powietrza
function getAirQualityColor(value) {
    if (value <= 50) {
        return { start: "green", end: "lightgreen" };
    } else if (value <= 100) {
        return { start: "yellow", end: "lightyellow" };
    } else if (value <= 150) {
        return { start: "#ff6600", end: "#ffcc66" };
    } else if (value <= 200) {
        return { start: "#ff3333", end: "#ff6666" };
    } else {
        return { start: "darkred", end: "brown" };
    }}

    