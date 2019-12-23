# MMM-Wunderlist
This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It can display your Wunderlist todos. You can add multiple instances with different lists. Only one account supported. The enhanced version will allow you to have multiple groupings per List added.

![Alt text](/MMM-Wunderlist-Enhanced.png?raw=true "Groupings")

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/funsocietyirc/MMM-Wunderlist-Enhanced.git`. A new folder will appear navigate into it.
2. Execute `npm install` to install the node dependencies.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-Wunderlist-Enhanced',
		position: 'top_right',	// This can be any of the regions. Best results in left or right regions.
		header: 'Wunderlist', // This is optional
		config: {
			// See 'Configuration options' for more information.
                        accessToken: "5f6f8b5972470536222ac5f0ab03230bbbcc5279f2aaa3c90f66db780bb1",  //example token
                        clientID: "da50f5c13e5c25f87c51",   //example clientID
                        lists: ["inbox","House to do"]			
		}
	}
]
````

## Configuration options

The following properties can be configured:


<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>accessToken</code></td>
			<td>REQUIRED: Your Wunderlist access token, you can get it <a href="https://developer.wunderlist.com/apps/new">here</a>.  Put any url in APP URL and Callback URL.<br>
				<br><b>Possible values:</b> <code>string</code>
				<br><b>Default value:</b> <code>none</code>
			</td>
		</tr>
		<tr>
			<td><code>clientID</code></td>
			<td>REQUIRED: Your Wunderlist client id, you can get it <a href="https://developer.wunderlist.com/apps/new">here</a>.   Put any url in APP URL and Callback URL.<br>
				<br><b>Possible values:</b> <code>string</code>
				<br><b>Default value:</b> <code>none</code>
			</td>
		</tr>
		<tr>
			<td><code>lists</code></td>
			<td>Array of lists you want to display. <br>
				Sub-categories will be generated via these lists.<br>
				<br><b>Possible values:</b> <code>array</code>
				<br><b>Default value:</b> <code>["inbox"]</code>
				<br><b>Example:</b> <code>["inbox", "ViRO Entertainment"]</code>
			</td>
		</tr>
		</tr>
		<tr>
			<td><code>order</code></td>
			<td>Order of tasks on the list. <br>
				<br><b>Possible values:</b> <code>"normal"</code>, <code>"reversed"</code>
				<br><b>Default value:</b> <code>"normal"</code>
			</td>
		</tr>
		<tr>
			<td><code>maximumEntries</code></td>
			<td>Maximum number of todos to be shown per list.<br>
				<br><b>Possible values:</b> <code>int</code> 
				<br><b>Default value:</b> <code>60</code>
			</td>
		</tr>
		<tr>
			<td><code>interval</code></td>
			<td>How often the module should load new todos.<br>
				<br><b>Possible values:</b> <code>int</code> in <code>seconds</code>
				<br><b>Default value:</b> <code>60</code>
			</td>
		</tr>
		<tr>
			<td><code>fade</code></td>
			<td>Fade todos to black. (Gradient)<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>fadePoint</code></td>
			<td>Where to start fade?<br>
				<br><b>Possible values:</b> <code>0</code> (top of the list) - <code>1</code> (bottom of list)
				<br><b>Default value:</b> <code>0.25</code>
			</td>
		</tr>
		<tr>
			<td><code>spaced</code></td>
			<td>Add more space between table rows<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
		<tr>
			<td><code>showDeadline</code></td>
			<td>Show deadline of a task<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>showAssignee</code></td>
			<td>Show due date of a task<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>iconPosition</code></td>
			<td>Where to position the star-icon and the (optional) bullet-icons<br>
				<br><b>Possible values:</b> 
                <ul>
                    <li><code>left</code> In a table column left of the title</li>
                    <li><code>right</code> In a table column right of the title</li>
                    <li><code>inline_left</code> Left of the title, in the same table cell</li>
                    <li><code>inline_right</code> Right of the title, in the same table cell</li>
                    <li><code>none</code> Show no icons (no bullets/no stars)</li>
                </ul>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>showBullets</code></td>
			<td>Show bullets, "&gt;" before the title if icons are aligned left, or "&lt;" after the title if icons are aligned right. Note, that stars are still shown for starred items if showBullets is set to off. <br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
	</tbody>
</table>

## Dependencies
- [wunderlist](https://www.npmjs.com/package/wunderlist) (installed via `npm install`)

## Known issues
- User list will not propigate until second refresh

The MIT License (MIT)
=====================

Copyright © 2017 Dave Richer
Copyright © 2016 Paul-Vincent Roll

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**
