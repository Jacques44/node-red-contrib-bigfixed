# node-red-contrib-bigfixed

"Big Fixed" is a Big Node for node-red. It's used to parse fixed length data

![alt tag](https://cloud.githubusercontent.com/assets/18165555/15263277/e8009d92-1968-11e6-8c49-8b77cd6f33e2.png)

![alt tag](https://cloud.githubusercontent.com/assets/18165555/15263279/eb14a00a-1968-11e6-9754-180c9d3930bd.png)

![alt tag](https://cloud.githubusercontent.com/assets/18165555/15263282/ed0c4278-1968-11e6-9828-4dbedb9b9c10.png)

## Installation
```bash
npm install node-red-contrib-bigfixed
```

## Principles for Big Nodes

###1 can handle big data or block mode

  That means, in block mode, not only "one message is a whole file" and able to manage start/end control messages

###2 send start/end messages as well as statuses

  That means it uses a second output to give control states (start/end/running and error) control messages

###3 tell visually what they are doing

  Visual status on the node tells it's ready/running (blue), all is ok and done (green) or in error (red)

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
[{"id":"e815133c.51499","type":"inject","z":"45551e3.4761ee","name":"Sample","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":90,"y":380,"wires":[["daba0d8e.1c97d"]]},{"id":"daba0d8e.1c97d","type":"function","z":"45551e3.4761ee","name":"Sample","func":"msg.payload = \"DATA1     DADA2     DATA3   \";\nmsg.description = [\n    { \"start\": 1, \"length\": 10, \"trim\": true, \"header\": \"H1\" },\n    { \"start\": 13, \"length\": 3, \"header\": \"D2\" },\n    { \"header\": \"LAST\", \"trim\": true }\n]\nreturn msg;","outputs":1,"noerr":0,"x":240,"y":380,"wires":[["14b0359e.09ceaa"]]},{"id":"14b0359e.09ceaa","type":"bigfixed","z":"45551e3.4761ee","name":"fixed","trim":false,"syntax":"javascript","description":"","ignore":true,"x":390,"y":380,"wires":[["6227844a.03530c"],["533ae4cf.d4effc"]]},{"id":"6227844a.03530c","type":"debug","z":"45551e3.4761ee","name":"data","active":true,"console":"false","complete":"payload","x":650,"y":360,"wires":[]},{"id":"a03070e0.2615a","type":"comment","z":"45551e3.4761ee","name":"Sample usage of Big Fixed","info":"","x":150,"y":320,"wires":[]},{"id":"533ae4cf.d4effc","type":"function","z":"45551e3.4761ee","name":"records","func":"if (msg.control && msg.control.state == 'end') return { payload: msg.control.records }","outputs":1,"noerr":0,"x":660,"y":400,"wires":[["1d83d2aa.65300d"]]},{"id":"1d83d2aa.65300d","type":"debug","z":"45551e3.4761ee","name":"records","active":true,"console":"false","complete":"payload","x":800,"y":400,"wires":[]},{"id":"662deb1b.fe4ea4","type":"inject","z":"45551e3.4761ee","name":"Sample","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":90,"y":440,"wires":[["a254be1a.1018d"]]},{"id":"a254be1a.1018d","type":"function","z":"45551e3.4761ee","name":"Error","func":"msg.payload = \"DATA1\";\nmsg.description = [\n    { \"start\": 1, \"length\": 10, \"trim\": true, \"header\": \"H1\" },\n    { \"start\": 13, \"length\": 3, \"header\": \"D2\" },\n    { \"header\": \"LAST\", \"trim\": true }\n]\nreturn msg;","outputs":1,"noerr":0,"x":230,"y":440,"wires":[["acb6ba80.50fcd8"]]},{"id":"acb6ba80.50fcd8","type":"bigfixed","z":"45551e3.4761ee","name":"fixed","trim":false,"syntax":"javascript","description":"","ignore":false,"x":390,"y":440,"wires":[[],[]]},{"id":"449785fb.af647c","type":"inject","z":"45551e3.4761ee","name":"Sample","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":90,"y":500,"wires":[["631f34c1.7cf36c"]]},{"id":"631f34c1.7cf36c","type":"function","z":"45551e3.4761ee","name":"Ignore","func":"msg.payload = \"DATA1\";\nmsg.description = [\n    { \"start\": 1, \"length\": 10, \"trim\": true, \"header\": \"H1\" },\n    { \"start\": 13, \"length\": 3, \"header\": \"D2\" },\n    { \"header\": \"LAST\", \"trim\": true }\n]\nmsg.ignore = true;\nreturn msg;","outputs":1,"noerr":0,"x":230,"y":500,"wires":[["3744f055.c967f"]]},{"id":"3744f055.c967f","type":"bigfixed","z":"45551e3.4761ee","name":"fixed","trim":false,"syntax":"javascript","description":"","ignore":false,"x":390,"y":500,"wires":[[],[]]}]
  ```

  ![alt tag](https://cloud.githubusercontent.com/assets/18165555/15263284/eef7107c-1968-11e6-8a12-f382da7b4adb.PNG)

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


