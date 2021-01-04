# jQuery Myanmar Vector Map

jQuery Plugins for Myanmar Vector Map (jqMVM), which includes all the states and townships, available in both English and Burmese.


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

First of all, it is necessary to provide options for jqMVM.

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

      });
```
