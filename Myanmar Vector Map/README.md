# jQuery Myanmar Vector Map

A jQuery Plugin for Myanmar Vector Map (jqMVM), which includes all the states and townships, available in both English and Burmese.

<a href="https://2kha.github.io/map.html" style="color:blue;" target="_blank">Live Demo</a> 

<img src="https://raw.githubusercontent.com/2kha/Visualizations/main/Myanmar%20Vector%20Map/images/myanmarmap.jpg" />


## Prerequisites

### Javascript Libraries

In order to be fully functional, jqMVM will require:

* jQuery
  ```sh
  https://code.jquery.com/
  ```
  
* Underscore JS
  ```sh
  https://underscorejs.org/
  ```
  
### SVG

In addition, it is necessay to host SVG Map files, and provide a link to SVG Map Files.

* SVG Link
  ```sh
  example: https://example.com/svg/
  ```
  
## Getting Started

jqMVM can be easily configured by providing configruation options.


### Options

```sh
      {
        //Options
        Culture: "en",   
	SelectedColor: '#82FA58',
	HoveredColor: '#d4e6f1',
	DefaultColor: '#d2f5f3',
	Data: [],
	Level: level,
	MapPath: svgUrl,
	Drilldown: false,
	Zoom: 1,
	ShowTooltip: true,
	
	//Events
	OnLoad: function (regions) {
	},
	OnClick: function (item) {
	},
	OnDoubleClick: function (item) {
	},
	OnHover: function (item){
	},
	OnBack: function (level){		
	}
      }
```

### Level

There are two levels in jqMVM: States Level and Township Level.


### Culture

There are two Langauge Cultures: "en" English and "mm" Burmese in jqMVM. 


### Data

Data can be provided to display visualization. For example, temperature by states, or population by townships.

Generally, data must be an array for townships or states, with Color and Item information.

```sh
	data = [
		{
			"Color" : "#A3B2F2"
			"Item"  : { "Name" : "M", "Temperature" : 23  }
		},
		{
			"Color" : "#A1B2F2"
			"Item"  : { "Name" : "B", "Temperature" : 23  }
		},
		...
		{
			"Color" : "#A1B2F2"
			"Item"  : { "Name" : "C", "Temperature" : 34  }
		},
	       ]
```

### AJAX

It is possible to feed data from Server-Side with Ajax

```sh
	var currentLevel = 0;

        var loadMap = function (level) {

            $.ajax({
                url: "https://example.com/map/",
                data: { level: level },
                type: "POST",
                success: function (response) {

                    var data = JSON.parse(response.json);

                    var map = $("#map").jqMyanmarVectorMap({

                        Culture: "mm",
                        SelectedColor: '#82FA58',
                        HoveredColor: '#d4e6f1',
                        DefaultColor: '#d2f5f3',
                        Data: data,
                        Level: level,
                        MapPath: '/scripts/Library/svg/',
                        Drilldown: false,
                        Zoom: 1,
                        ShowTooltip: true,
			
                        OnLoad: function (regions) {
                        },
                        OnClick: function (item) {
                        },
                        OnDoubleClick: function (item) {

                            var l = parseInt(item.id);

                            if (currentLevel == 0) {
                                currentLevel = 1;                                
                                loadMap(l);
                            }

                        },
                        OnHover: function (item) {

                        },
                        OnBack: function (level) {

                            currentLevel = 0;
                            loadMap(level);
                        }

                    });
                },
                error: function () {

                }
            });

        };

        loadMap(currentLevel);
```

