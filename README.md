# node-red-contrib-bigfixed

"Big Fixed" is a Big Node for node-red. It's used to parse fixed length data

![alt tag](https://cloud.githubusercontent.com/assets/18165555/15455964/d587f2ea-2062-11e6-99c1-e74f7bd7a6df.png)

![alt tag](https://cloud.githubusercontent.com/assets/18165555/15455967/dc8d9a22-2062-11e6-986d-bc192ffa95de.png)

## Installation
```bash
npm install node-red-contrib-bigfixed
```

## Principles for Big Nodes

See [biglib](https://www.npmjs.com/package/node-red-biglib) for details on Big Nodes.
`Big Lib` and subsequent `Big Nodes` are a family of nodes built for my own purpose. They are all designed to help me build a complete process for **production purposes**. For that I needed nodes able to:

* Flow **big volume** of data (memory control, work with buffers)
* Work with *a flow of blocks* (buffers) (multiple payload within a single job)
* Tell what *they are doing* with extended use of statuses (color/message)
* Use their *second output for flow control* (start/stop/running/status)
* *Reuse messages* in order to propagate _msgid, topic
* Depends on **state of the art** libraries for parsing (csv, xml, xlsxs, line, ...)
* Acts as **filters by default** (1 payload = 1 action) or **data generators** (block flow)

All functionnalities are built under a library named `biglib` and all `Big Nodes` rely on it

## Dependencies

[biglib](https://www.npmjs.com/package/node-red-biglib) library for building node-red flows that supports blocks, high volume

## Capabilities

* This node's purpose is to parse fixed length data. Description is provided by configuration or the **msg.description** property.
* Format is a JSON array for column description. Each column is described by either a **start**, **length**, **end** value (all starting by 1)**, a **header**
* Different combinations are allowed as only **start** or **start + length** or **start + end**
* If no **header** is provider, the value is bound to a default named property **Col #**
* The **trim** flag is allowed for each column description or as a global parameter
* It's also possible to give a **map** translation table as for example ```json map": { "O": true, "N": false }```

## Example flow files

Try pasting in the flow file below that shows the node behaviour 

  ```json
[{"id":"123e3061.edc1d","type":"inject","z":"de6fd7b8.219028","name":"Sample","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":130,"y":120,"wires":[["7d6e179.f8291e8"]]},{"id":"7d6e179.f8291e8","type":"function","z":"de6fd7b8.219028","name":"Sample","func":"msg.payload = \"DATA1     DADA2     DATA3   \";\nreturn msg;","outputs":1,"noerr":0,"x":280,"y":120,"wires":[["e6f9a5eb.190658"]]},{"id":"e6f9a5eb.190658","type":"bigfixed","z":"de6fd7b8.219028","name":"fixed","trim":false,"syntax":"javascript","description":"[\n    { \"start\": 1, \"length\": 10, \"trim\": true, \"header\": \"H1\" },\n    { \"start\": 13, \"length\": 3, \"header\": \"D2\" },\n    { \"header\": \"LAST\", \"trim\": true }\n]","ignore":true,"x":430,"y":120,"wires":[["5725bc93.a8da44"],["2087e47b.df781c"]]},{"id":"5725bc93.a8da44","type":"debug","z":"de6fd7b8.219028","name":"data","active":true,"console":"false","complete":"payload","x":690,"y":100,"wires":[]},{"id":"cf7165e3.308e98","type":"comment","z":"de6fd7b8.219028","name":"Sample usage of Big Fixed","info":"","x":190,"y":60,"wires":[]},{"id":"2087e47b.df781c","type":"function","z":"de6fd7b8.219028","name":"records","func":"if (msg.control && msg.control.state == 'end') return { payload: msg.control.records }","outputs":1,"noerr":0,"x":700,"y":140,"wires":[["1d141fec.e2ebe"]]},{"id":"1d141fec.e2ebe","type":"debug","z":"de6fd7b8.219028","name":"records","active":true,"console":"false","complete":"payload","x":840,"y":140,"wires":[]},{"id":"ff8b58af.0074a8","type":"inject","z":"de6fd7b8.219028","name":"Sample","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":130,"y":180,"wires":[["d7b9e1c9.28462"]]},{"id":"d7b9e1c9.28462","type":"function","z":"de6fd7b8.219028","name":"Error","func":"msg.payload = \"DATA1\";\nmsg.description = [\n    { \"start\": 1, \"length\": 10, \"trim\": true, \"header\": \"H1\" },\n    { \"start\": 13, \"length\": 3, \"header\": \"D2\" },\n    { \"header\": \"LAST\", \"trim\": true }\n]\nreturn msg;","outputs":1,"noerr":0,"x":270,"y":180,"wires":[["8dcbdd77.72342"]]},{"id":"8dcbdd77.72342","type":"bigfixed","z":"de6fd7b8.219028","name":"fixed","trim":false,"syntax":"javascript","description":"","ignore":false,"x":430,"y":180,"wires":[[],[]]},{"id":"aa93452c.556cb8","type":"inject","z":"de6fd7b8.219028","name":"Sample","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":130,"y":240,"wires":[["a42c9bfa.5bd368"]]},{"id":"a42c9bfa.5bd368","type":"function","z":"de6fd7b8.219028","name":"Ignore","func":"msg.payload = \"DATA1\";\nmsg.description = [\n    { \"start\": 1, \"length\": 10, \"trim\": true, \"header\": \"H1\" },\n    { \"start\": 13, \"length\": 3, \"header\": \"D2\" },\n    { \"header\": \"LAST\", \"trim\": true }\n]\nmsg.ignore = true;\nreturn msg;","outputs":1,"noerr":0,"x":270,"y":240,"wires":[["c1d5c08f.3e2a4"]]},{"id":"c1d5c08f.3e2a4","type":"bigfixed","z":"de6fd7b8.219028","name":"fixed","trim":false,"syntax":"javascript","description":"","ignore":false,"x":430,"y":240,"wires":[[],[]]}]
  ```

  ![alt tag](https://cloud.githubusercontent.com/assets/18165555/15455962/c7044bce-2062-11e6-82a0-56b7b1874a28.png)

## Usage

This node has 3 properties:

* A **data format**, required, used to parse incoming data. The format is an array of json document as for example:

```json
[
    { "start": 1, "length": 10, "trim": true, "header": "H1" },
    { "start": 13, "length": 3, "header": "D2" },
    { "header": "LAST", "trim": true }
]
```json

The properties are the following:

> * `header` to set the property name. If not set, properties will be `Col1`, `Col2` and so on
> * `start` to set the first column (starting by 1)
> * `end` to set the last column (starting by 1)
> * `length` to compute the end value
> * `trim` to trim spaces 
> * `re` a regex to capture data
> * `map` a mapping json key/value object for mapping. For example ```json{ "O": true, "N": false }```

* A **Trim each value** flag used to trim spaces from each element of each line
* A **Silently ignore non matching** flag which allows non matching data without throwning errors

It is possible to send these configuration options using an incoming message setting respectively `msg.description`, `msg.trim` and `msg.ignore`

## Author

  - Jacques W

## License

This code is Open Source under an Apache 2 License.

You may not use this code except in compliance with the License. You may obtain an original copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Please see the
License for the specific language governing permissions and limitations under the License.

## Feedback and Support

Please report any issues or suggestions via the [Github Issues list for this repository](https://github.com/Jacques44/node-red-contrib-bigfixed/issues).

For more information, feedback, or community support see the Node-Red Google groups forum at https://groups.google.com/forum/#!forum/node-red


