/**
 * Copyright 2013, 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Original and good work by IBM
 * "Big Nodes" mods by Jacques W
 *
 * /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
 *
 *  Big Nodes principles:
 *
 *  #1 can handle big data
 *  #2 send start/end messages
 *  #3 tell what they are doing
 *
 *  Any issues? https://github.com/Jacques44
 *
 * /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
 *
 **/

module.exports = function(RED) {

    "use strict";

    var biglib = require('node-red-biglib');
    var stream = require('stream');

    function fixed2json() {
      this.description = [];
      this.trim = false;    
    }

    fixed2json.prototype.setup = function(config)
    {
 
      config = config || {};
      this.description = config.description || [];
      this.trim = config.hasOwnProperty('trim')?config.trim:false;
      this._ignore = config.hasOwnProperty('ignore')?config.ignore:false;

      var description = this.description;

      var re_str = ""; var prev = 1;
      for (i = 0; i < description.length; i++) {
          var start = description[i].hasOwnProperty('start') ? description[i].start : prev;

          var length = description[i].length;
          if (!length && description[i].hasOwnProperty('end')) length = description[i].end - start + 1;
          if (!length && i + 1 < description.length) length = description[i+1].start - start;

          var re = description[i].hasOwnProperty('re') ? description[i].re : '.';
          
          if (length) {
              re_str += "(" + re + "{" + length + "})";
          } else {
              re_str += "(.*)";
          }
      }

      this._regex = new RegExp("^" + re_str + "$");

      this._map = [];

      description.forEach(function(e, i) {
          var h = e.header || "Col" + (i+1);
          var trim = this.trim;
          var v = e.validate || function(d) { return d };
          if (e.map) {
            var m = e.map;
            v = function(d) { return m[d] };
          }
          this._map[i] = e.trim || trim ? function(d, ret) { ret[h] = v(d.trim()) } : function(d, ret) { ret[h] = v(d) }        
      }.bind(this));
    }

    fixed2json.prototype.parse = function(d) {
      var m = this._regex.exec(d);
      
      if (!m) {
        if (!this._ignore) throw new Error("Data doesn't match given description");
        return;
      }

      var ret = {};
      for (var i = 0; i < this._map.length; i++) {
          this._map[i](m[i+1], ret);
      }

      return ret;
    }

    fixed2json.prototype.stream = function(config) {

      if (!config.description || config.description.length == 0) throw new Error("There is no description");

      if (config) this.setup(config);

      var outstream = new stream.Transform({ objectMode: true });
      var f = this;

      outstream._transform = (function(data, encoding, done) {
        try {
          var ret = f.parse(data);
          if (ret) this.push(ret);        
        } catch (err) {
          this.emit('error', err);
        }
        done();
      });      

      return outstream;      
    }

    var fixed = new fixed2json(); 

    // Definition of which options are known
    var fixed_options = {
      "trim": false,
      "description": { value: [], validation: 
        function(d) { 
          try { 
            return typeof d == 'object' ? d : JSON.parse(d)
          } catch (err) {
            throw new Error("Description is not valid: " + err.message);
          } 
        } 
      },
      "ignore": false
    }    

    function BigFixed(config) {

      RED.nodes.createNode(this, config);

      // new instance of biglib for this configuration
      // probably the most tuned biglib I've asked ever...
      var bignode = new biglib({ 
        config: config, node: this,   // biglib needs to know the node configuration and the node itself (for statuses and sends)
        parser_config: fixed_options, // the parser configuration (ie the known options the parser will understand)
        status: 'records', 
        parser: fixed.stream.bind(fixed)          // the parser (ie the remote command)
      });

      // biglib changes the configuration to add some properties
      config = bignode.config();

      this.on('input', function(msg) {    
      
        // if no configuration available from the incoming message, a new one is returned, cloned from default
        msg.config = bignode.new_config(msg.config);  

        if (msg.description) msg.config.description = msg.description;
        if (msg.hasOwnProperty('trim')) msg.config.trim = msg.trim;
        if (msg.hasOwnProperty('ignore')) msg.config.ignore = msg.ignore;

        bignode.main.call(bignode, msg);
      })

    }

    RED.nodes.registerType("bigfixed", BigFixed);

}
