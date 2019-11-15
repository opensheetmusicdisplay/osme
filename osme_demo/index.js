import { OpenSheetMusicDisplay } from '../src/OpenSheetMusicDisplay/OpenSheetMusicDisplay';
import { ExampleSourceGenerator } from '../src/OSME/SourceGenerator/ExampleSourceGenerator';
import { XMLSourceExporter } from '../src/OSME/SourceExporter/XMLSourceExporter';
import { SourceGeneratorPlugin, GeneratorPluginOptions } from '../src/OSME/SourceGenerator/SourceGeneratorPlugin';
import { PitchSettings, NoteEnum, AccidentalEnum, DefaultInstrumentOptions, DurationSettings, Label, MusicSheet } from '../src';
import { ScaleKey } from '../src/OSME/Common';
import { RhythmInstruction, RhythmSymbolEnum } from '../src/MusicalScore/VoiceData/Instructions';
import { Fraction } from '../src/Common/DataObjects';
//import * as OSME from '../src/OSME';

/*jslint browser:true */
(function () {
    "use strict";
    var openSheetMusicDisplay;
    var osme;

    var sampleFolder = process.env.STATIC_FILES_SUBFOLDER ? process.env.STATIC_FILES_SUBFOLDER + "/" : "",
        samples = {
            "Beethoven, L.v. - An die ferne Geliebte": "Beethoven_AnDieFerneGeliebte.xml",
            "Clementi, M. - Sonatina Op.36 No.1 Pt.1": "MuzioClementi_SonatinaOpus36No1_Part1.xml",
            "Clementi, M. - Sonatina Op.36 No.1 Pt.2": "MuzioClementi_SonatinaOpus36No1_Part2.xml",
            "Clementi, M. - Sonatina Op.36 No.3 Pt.1": "MuzioClementi_SonatinaOpus36No3_Part1.xml",
            "Clementi, M. - Sonatina Op.36 No.3 Pt.2": "MuzioClementi_SonatinaOpus36No3_Part2.xml",
            "Bach, J.S. - Praeludium in C-Dur BWV846 1": "JohannSebastianBach_PraeludiumInCDur_BWV846_1.xml",
            "Bach, J.S. - Air": "JohannSebastianBach_Air.xml",
            "Gounod, C. - Méditation": "CharlesGounod_Meditation.xml",
            "Haydn, J. - Concertante Cello": "JosephHaydn_ConcertanteCello.xml",
            "Joplin, S. - Elite Syncopations": "ScottJoplin_EliteSyncopations.xml",
            "Joplin, S. - The Entertainer": "ScottJoplin_The_Entertainer.xml",
            "Mozart, W.A. - An Chloe": "Mozart_AnChloe.xml",
            "Mozart, W.A. - Das Veilchen": "Mozart_DasVeilchen.xml",
            "Mozart, W.A. - Clarinet Quintet (Excerpt)": "Mozart_Clarinet_Quintet_Excerpt.mxl",
            "Mozart, W.A. - String Quartet in G, K. 387, 1st Mvmt Excerpt": "Mozart_String_Quartet_in_G_K._387_1st_Mvmnt_excerpt.musicxml",
            "Mozart/Holzer - Land der Berge (national anthem of Austria)": "Land_der_Berge.musicxml",
            "OSMD Function Test - All": "OSMD_function_test_all.xml",
            "OSMD Function Test - Accidentals": "OSMD_function_test_accidentals.musicxml",
            "OSMD Function Test - Autobeam": "OSMD_function_test_autobeam.musicxml",
            "OSMD Function Test - Auto-/Custom-Coloring": "OSMD_function_test_auto-custom-coloring-entchen.musicxml",
            "OSMD Function Test - Bar lines": "OSMD_function_test_bar_lines.musicxml",
            "OSMD Function Test - Color (from XML)": "OSMD_function_test_color.musicxml",
            "OSMD Function Test - Drumset": "OSMD_function_test_drumset.musicxml",
            "OSMD Function Test - Expressions": "OSMD_function_test_expressions.musicxml",
            "OSMD Function Test - Expressions Overlap": "OSMD_function_test_expressions_overlap.musicxml",
            "OSMD Function Test - Grace Notes": "OSMD_function_test_GraceNotes.xml",
            "OSMD Function Test - Invisible Notes": "OSMD_function_test_invisible_notes.musicxml",
            "OSMD Function Test - Selecting Measures To Draw": "OSMD_function_test_measuresToDraw_Beethoven_AnDieFerneGeliebte.xml",
            "OSMD Function Test - Notehead Shapes": "OSMD_function_test_noteheadShapes.musicxml",
            "OSMD Function Test - Ornaments": "OSMD_function_test_Ornaments.xml",
            "OSMD Function Test - Tremolo": "OSMD_Function_Test_Tremolo_2bars.musicxml",
            "Schubert, F. - An Die Musik": "Schubert_An_die_Musik.xml",
            "Actor, L. - Prelude (Large Sample, loading time)": "ActorPreludeSample.xml",
            "Anonymous - Saltarello": "Saltarello.mxl",
            "Debussy, C. - Mandoline": "Debussy_Mandoline.xml",
            "Levasseur, F. - Parlez Mois": "Parlez-moi.mxl",
            "Schumann, R. - Dichterliebe": "Dichterliebe01.xml",
            "Telemann, G.P. - Sonate-Nr.1.1-Dolce": "TelemannWV40.102_Sonate-Nr.1.1-Dolce.xml",
            "Telemann, G.P. - Sonate-Nr.1.2-Allegro": "TelemannWV40.102_Sonate-Nr.1.2-Allegro-F-Dur.xml",
        },

        zoom = 1.0,
        // HTML Elements in the page
        err,
        error_tr,
        canvas,

        selectSample,
        editTitle,
        editComposer,
        editTempo,
        downloadFile,
        selectMeasureNumber,
        selectTimeSignature,
        selectKeySignature,
        selectComplexity,

        selectBounding,
        skylineDebug,
        bottomlineDebug,
        custom,
        debugReRenderBtn,
        debugOutput,
        debugClearBtn;

    var minMeasureToDrawStashed = 1;
    var maxMeasureToDrawStashed = Number.MAX_SAFE_INTEGER;
    var measureToDrawRangeNeedsReset = false;

    var generatedSheet; // OSME-generated sheet
    var generatedGraphicSheet; // OSME-generated GraphicalMusicSheet

    // Initialization code
    function init() {
        var name, option;

        err = document.getElementById("error-td");
        error_tr = document.getElementById("error-tr");

        custom = document.createElement("option");
        editTitle = document.getElementById("editTitle");
        editTitle.value = "Sight reading practice"
        editComposer = document.getElementById("editComposer");
        editComposer.value = "Created by OSME"
        editTempo = document.getElementById("editTempo");
        downloadFile = document.getElementById("downloadFile");
        //selectSample = document.getElementById("selectSample");
        selectTimeSignature = document.getElementById("selectTimeSignature");
        selectTimeSignature.value = 4;
        selectMeasureNumber = document.getElementById("selectMeasureNumber");
        selectMeasureNumber.value = 1;
        selectKeySignature = document.getElementById("selectKeySignature");
        selectComplexity = document.getElementById("selectComplexity");
        //selectBounding = document.getElementById("selectBounding");
        //skylineDebug = document.getElementById("skylineDebug");
        //bottomlineDebug = document.getElementById("bottomlineDebug");
        canvas = document.createElement("div");

        debugReRenderBtn = document.getElementById("debug-re-render-btn");
        debugClearBtn = document.getElementById("debug-clear-btn");
        debugOutput = document.getElementById("debug-output");

        // Hide error
        error();

        // Create select
        // for (name in samples) {
        //     if (samples.hasOwnProperty(name)) {
        //         option = document.createElement("option");
        //         option.value = samples[name];
        //         option.textContent = name;
        //     }
        //     selectSample.appendChild(option);
        // }
        // selectSample.onchange = loadAndDisplay;
        // if (selectBounding) {
        //     selectBounding.onchange = selectBoundingOnChange;
        // }

        selectMeasureNumber.onchange = generatorCreatePractice;
        selectTimeSignature.onchange = generatorCreatePractice;
        selectKeySignature.onchange = generatorCreatePractice;
        selectComplexity.onchange = generatorCreatePractice;
        editTempo.onchange = generatorCreatePractice;
        // Pre-select default music piece

        //custom.appendChild(document.createTextNode("Custom"));

        // Create zoom controls

        // if (skylineDebug) {
        //     skylineDebug.onclick = function () {
        //         openSheetMusicDisplay.DrawSkyLine = !openSheetMusicDisplay.DrawSkyLine;
        //     }
        // }

        // if (bottomlineDebug) {
        //     bottomlineDebug.onclick = function () {
        //         openSheetMusicDisplay.DrawBottomLine = !openSheetMusicDisplay.DrawBottomLine;
        //     }
        // }

        if (debugReRenderBtn) {
            debugReRenderBtn.onclick = function () {
                rerender();
            }
        }
        if (downloadFile) {
            downloadFile.onclick = function () {
                downloadMusicxml();
            }
        }

        if (debugClearBtn) {
            debugClearBtn.onclick = function () {
                openSheetMusicDisplay.clear();
            }
        }

        //  osme = new OSME()
        // Create OSMD object and canvas
        openSheetMusicDisplay = new OpenSheetMusicDisplay(canvas, {
            autoResize: true,
            backend: "SVG",
            disableCursor: false,
            drawingParameters: "default", // try compact (instead of default)
            drawPartNames: true, // try false
            // drawTitle: false,
            // drawSubtitle: false,
            //drawFromMeasureNumber: 4,
            //drawUpToMeasureNumber: 8,
            drawFingerings: true,
            fingeringPosition: "auto", // left is default. try right. experimental: auto, above, below.
            // fingeringInsideStafflines: "true", // default: false. true draws fingerings directly above/below notes
            setWantedStemDirectionByXml: true, // try false, which was previously the default behavior
            // drawUpToMeasureNumber: 3, // draws only up to measure 3, meaning it draws measure 1 to 3 of the piece.

            // coloring options
            coloringEnabled: true,
            // defaultColorNotehead: "#CC0055", // try setting a default color. default is black (undefined)
            // defaultColorStem: "#BB0099",

            autoBeam: true, // try true, OSMD Function Test AutoBeam sample
            autoBeamOptions: {
                beam_rests: false,
                beam_middle_rests_only: false,
                //groups: [[3,4], [1,1]],
                maintain_stem_directions: false
            },
            xmlGenerator: null,

            // tupletsBracketed: true, // creates brackets for all tuplets except triplets, even when not set by xml
            // tripletsBracketed: true,
            // tupletsRatioed: true, // unconventional; renders ratios for tuplets (3:2 instead of 3 for triplets)
        });
        openSheetMusicDisplay.setLogLevel('info');
        document.body.appendChild(canvas);

        window.addEventListener("keydown", function (e) {
            var event = window.event ? window.event : e;
            if (event.keyCode === 39) {
                openSheetMusicDisplay.cursor.next();
            }
        });
    }

    function selectBoundingOnChange(evt) {
        var value = evt.target.value;
        openSheetMusicDisplay.DrawBoundingBox = value;
    }

    function loadAndDisplay(str = "") {
        error();
        disable();
        // var isCustom = typeof str === "string";
        // if (!isCustom) {
        //     str = sampleFolder + selectSample.value;
        // }
        zoom = 1.0;

        // if (str.includes("measuresToDraw")) {
        //     // stash previously set range of measures to draw
        //     if (!measureToDrawRangeNeedsReset) { // only stash once, when measuresToDraw called multiple times in a row
        //         minMeasureToDrawStashed = openSheetMusicDisplay.EngravingRules.MinMeasureToDrawIndex + 1;
        //         maxMeasureToDrawStashed = openSheetMusicDisplay.EngravingRules.MaxMeasureToDrawIndex + 1;
        //     }
        //     measureToDrawRangeNeedsReset = true;

        //     // for debugging: draw from a random range of measures
        //     let minMeasureToDraw = Math.ceil(Math.random() * 15); // measures start at 1 (measureIndex = measure number - 1 elsewhere)
        //     let maxMeasureToDraw = Math.ceil(Math.random() * 15);
        //     if (minMeasureToDraw > maxMeasureToDraw) {
        //         minMeasureToDraw = maxMeasureToDraw;
        //         let a = minMeasureToDraw;
        //         maxMeasureToDraw = a;
        //     }
        //     //minMeasureToDraw = 1; // set your custom indexes here. Drawing only one measure can be a special case
        //     //maxMeasureToDraw = 1;
        //     console.log("drawing measures in the range: [" + minMeasureToDraw + "," + maxMeasureToDraw + "]");
        //     openSheetMusicDisplay.setOptions({
        //         drawFromMeasureNumber: minMeasureToDraw,
        //         drawUpToMeasureNumber: maxMeasureToDraw
        //     });
        // } else if (measureToDrawRangeNeedsReset) { // reset for other samples
        //     openSheetMusicDisplay.setOptions({
        //         drawFromMeasureNumber: minMeasureToDrawStashed,
        //         drawUpToMeasureNumber: maxMeasureToDrawStashed
        //     });
        //     measureToDrawRangeNeedsReset = false;
        // }

        // Enable Boomwhacker-like coloring for OSMD Function Test - Auto-Coloring (Boomwhacker-like, custom color set)
        if (str.includes("auto-custom-coloring")) {
            //openSheetMusicDisplay.setOptions({coloringMode: 1}); // Auto-Coloring with pre-defined colors
            openSheetMusicDisplay.setOptions({
                coloringMode: 2, // custom coloring set. 0 would be XML, 1 autocoloring
                coloringSetCustom: ["#d82c6b", "#F89D15", "#FFE21A", "#4dbd5c", "#009D96", "#43469d", "#76429c", "#ff0000"],
                // last color value of coloringSetCustom is for rest notes

                colorStemsLikeNoteheads: true
            });
        } else {
            openSheetMusicDisplay.setOptions({ coloringMode: 0, colorStemsLikeNoteheads: false });
        }
        //openSheetMusicDisplay.setOptions({ autoBeam: str.includes("autobeam") });
        //openSheetMusicDisplay.setOptions({ drawPartAbbreviations: !str.includes("Schubert_An_die_Musik") }); // TODO weird layout bug here. but shouldn't be in score anyways
        // openSheetMusicDisplay.load(str).then(
        //     function () {
        //         // This gives you access to the osmd object in the console. Do not use in productive code
        //         window.osmd = openSheetMusicDisplay;
        //         return openSheetMusicDisplay.render();
        //     },
        //     function (e) {
        //         errorLoadingOrRenderingSheet(e, "rendering");
        //     }
        // ).then(
        //     function () {
        //         return onLoadingEnd(isCustom);
        //     }, function (e) {
        //         errorLoadingOrRenderingSheet(e, "loading");
        //         onLoadingEnd(isCustom);
        //     }
        // );

        window.osmd = openSheetMusicDisplay;
        generatorCreatePractice();
    }

    function errorLoadingOrRenderingSheet(e, loadingOrRenderingString) {
        var errorString = "Error " + loadingOrRenderingString + " sheet: " + e;
        // if (process.env.DEBUG) { // people may not set a debug environment variable for the demo.
        // Always giving a StackTrace might give us more and better error reports.
        // TODO for a release, StackTrace control could be reenabled
        errorString += "\n" + "StackTrace: \n" + e.stack;
        // }
        console.warn(errorString);
    }

    function onLoadingEnd(isCustom) {
        // Remove option from select
        if (!isCustom && custom.parentElement === selectSample) {
            selectSample.removeChild(custom);
        }
        // Enable controls again
        enable();
    }

    function logCanvasSize() {
        // zoomDiv.innerHTML = Math.floor(zoom * 100.0) + "%";
    }

    function scale() {
        disable();
        window.setTimeout(function () {
            openSheetMusicDisplay.zoom = zoom;
            openSheetMusicDisplay.render();
            enable();
        }, 0);
    }

    function generatorCreatePractice() {
        var numberOfMeasures = selectMeasureNumber.value;
        var time = selectTimeSignature.value;
        var key = selectKeySignature.value;
        var complexity = selectComplexity.value / 10;
        var tempo = editTempo.value;

        var instrumentOptions = DefaultInstrumentOptions.get("trumpet");
        var timeSignature = new RhythmInstruction(new Fraction(time, 4, 0, false), RhythmSymbolEnum.NONE);
        var pitchSettings = PitchSettings.PENTATONIC();
        var durationSettings = DurationSettings.TYPICAL();

        var scaleKey = ScaleKey.fromStringCode(key)
        var generatorPluginOptions = {
            complexity: complexity,
            measure_count: numberOfMeasures,
            tempo: tempo,
            time_signature: timeSignature,
            scale_key: scaleKey,
            instruments: [instrumentOptions],
            pitch_settings: pitchSettings,
            duration_settings: durationSettings,
        }

        console.log("generatorPluginOptions: ", generatorPluginOptions);

        var generatorPlugin = new ExampleSourceGenerator(generatorPluginOptions);
        var sheet = generatorPlugin.generate();
        sheet.title = new Label(editTitle.value); //"Sight reading practice");
        sheet.composer = new Label(editComposer.value); //"Created by OSME");
        generatedSheet = sheet;
        var graphicalSheet = generatorPlugin.generateGraphicalMusicSheet(sheet);
        generatedGraphicSheet = graphicalSheet;
        console.log("generateGraphicalMusicSheet: done");

        renderGeneratedSheet();

        exportGeneratedSheet();
    }

    function exportGeneratedSheet() {
        try {
            var exporter = new XMLSourceExporter();
            const outputTxt = exporter.export(generatedSheet);
            // debugOutput.textContent = outputTxt;
            return outputTxt;
        } catch (exception) {
            console.error(exception);
        }
    }

    function downloadMusicxml() {
        var xmlContent = exportGeneratedSheet();
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(xmlContent));
        element.setAttribute('download', "text.musicxml");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        return false;
    }

    function renderGeneratedSheet() {
        //openSheetMusicDisplay.reset();
        openSheetMusicDisplay.sheet = generatedSheet;
        openSheetMusicDisplay.graphic = generatedGraphicSheet;
        console.log("render: start");
        openSheetMusicDisplay.render();
        enable();
    }

    function rerender() {
        window.setTimeout(function () {
            generatorCreatePractice();
            //renderGeneratedSheet(); // load same sheet again, for (OSMD) debugging (commentate above line)
            enable();
        }, 0);
    }

    function error(errString) {
        if (!errString) {
            error_tr.style.display = "none";
        } else {
            err.textContent = errString;
            error_tr.style.display = "";
            canvas.width = canvas.height = 0;
            enable();
        }
    }

    // Enable/Disable Controls
    function disable() {
        document.body.style.opacity = 0.3;
        //selectSample.disabled = "disabled";
    }
    function enable() {
        document.body.style.opacity = 1;
        //selectSample.disabled = "";
        logCanvasSize();
    }

    // Register events: load, drag&drop
    window.addEventListener("load", function () {
        init();
        loadAndDisplay();
    });
    window.addEventListener("dragenter", function (event) {
        event.preventDefault();
        disable();
    });
    window.addEventListener("dragover", function (event) {
        event.preventDefault();
    });
    window.addEventListener("dragleave", function (event) {
        enable();
    });
    window.addEventListener("drop", function (event) {
        event.preventDefault();
        if (!event.dataTransfer || !event.dataTransfer.files || event.dataTransfer.files.length === 0) {
            return;
        }
        // Add "Custom..." score
        //selectSample.appendChild(custom);
        custom.selected = "selected";
        // Read dragged file
        var reader = new FileReader();
        reader.onload = function (res) {
            loadAndDisplay(res.target.result);
        };
        var filename = event.dataTransfer.files[0].name;
        if (filename.toLowerCase().indexOf(".xml") > 0
            || filename.toLowerCase().indexOf(".musicxml") > 0) {
            reader.readAsText(event.dataTransfer.files[0]);
        } else if (event.dataTransfer.files[0].name.toLowerCase().indexOf(".mxl") > 0) {
            reader.readAsBinaryString(event.dataTransfer.files[0]);
        }
        else {
            alert("No vaild .xml/.mxl/.musicxml file!");
        }
    });
}());
