/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const web = $root.web = (() => {

    /**
     * Namespace web.
     * @exports web
     * @namespace
     */
    const web = {};

    web.WebContainer = (function() {

        /**
         * Properties of a WebContainer.
         * @memberof web
         * @interface IWebContainer
         * @property {web.INoiseMessage|null} [noiseMessage] WebContainer noiseMessage
         */

        /**
         * Constructs a new WebContainer.
         * @memberof web
         * @classdesc Represents a WebContainer.
         * @implements IWebContainer
         * @constructor
         * @param {web.IWebContainer=} [properties] Properties to set
         */
        function WebContainer(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * WebContainer noiseMessage.
         * @member {web.INoiseMessage|null|undefined} noiseMessage
         * @memberof web.WebContainer
         * @instance
         */
        WebContainer.prototype.noiseMessage = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * WebContainer payload.
         * @member {"noiseMessage"|undefined} payload
         * @memberof web.WebContainer
         * @instance
         */
        Object.defineProperty(WebContainer.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["noiseMessage"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new WebContainer instance using the specified properties.
         * @function create
         * @memberof web.WebContainer
         * @static
         * @param {web.IWebContainer=} [properties] Properties to set
         * @returns {web.WebContainer} WebContainer instance
         */
        WebContainer.create = function create(properties) {
            return new WebContainer(properties);
        };

        /**
         * Encodes the specified WebContainer message. Does not implicitly {@link web.WebContainer.verify|verify} messages.
         * @function encode
         * @memberof web.WebContainer
         * @static
         * @param {web.IWebContainer} message WebContainer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WebContainer.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.noiseMessage != null && Object.hasOwnProperty.call(message, "noiseMessage"))
                $root.web.NoiseMessage.encode(message.noiseMessage, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified WebContainer message, length delimited. Does not implicitly {@link web.WebContainer.verify|verify} messages.
         * @function encodeDelimited
         * @memberof web.WebContainer
         * @static
         * @param {web.IWebContainer} message WebContainer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WebContainer.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WebContainer message from the specified reader or buffer.
         * @function decode
         * @memberof web.WebContainer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {web.WebContainer} WebContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WebContainer.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.web.WebContainer();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.noiseMessage = $root.web.NoiseMessage.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a WebContainer message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof web.WebContainer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {web.WebContainer} WebContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WebContainer.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WebContainer message.
         * @function verify
         * @memberof web.WebContainer
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WebContainer.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.noiseMessage != null && message.hasOwnProperty("noiseMessage")) {
                properties.payload = 1;
                {
                    let error = $root.web.NoiseMessage.verify(message.noiseMessage);
                    if (error)
                        return "noiseMessage." + error;
                }
            }
            return null;
        };

        /**
         * Creates a WebContainer message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof web.WebContainer
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {web.WebContainer} WebContainer
         */
        WebContainer.fromObject = function fromObject(object) {
            if (object instanceof $root.web.WebContainer)
                return object;
            let message = new $root.web.WebContainer();
            if (object.noiseMessage != null) {
                if (typeof object.noiseMessage !== "object")
                    throw TypeError(".web.WebContainer.noiseMessage: object expected");
                message.noiseMessage = $root.web.NoiseMessage.fromObject(object.noiseMessage);
            }
            return message;
        };

        /**
         * Creates a plain object from a WebContainer message. Also converts values to other types if specified.
         * @function toObject
         * @memberof web.WebContainer
         * @static
         * @param {web.WebContainer} message WebContainer
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WebContainer.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.noiseMessage != null && message.hasOwnProperty("noiseMessage")) {
                object.noiseMessage = $root.web.NoiseMessage.toObject(message.noiseMessage, options);
                if (options.oneofs)
                    object.payload = "noiseMessage";
            }
            return object;
        };

        /**
         * Converts this WebContainer to JSON.
         * @function toJSON
         * @memberof web.WebContainer
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WebContainer.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return WebContainer;
    })();

    web.NoiseMessage = (function() {

        /**
         * Properties of a NoiseMessage.
         * @memberof web
         * @interface INoiseMessage
         * @property {web.NoiseMessage.MessageType|null} [messageType] NoiseMessage messageType
         * @property {Uint8Array|null} [content] NoiseMessage content
         */

        /**
         * Constructs a new NoiseMessage.
         * @memberof web
         * @classdesc Represents a NoiseMessage.
         * @implements INoiseMessage
         * @constructor
         * @param {web.INoiseMessage=} [properties] Properties to set
         */
        function NoiseMessage(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NoiseMessage messageType.
         * @member {web.NoiseMessage.MessageType} messageType
         * @memberof web.NoiseMessage
         * @instance
         */
        NoiseMessage.prototype.messageType = 0;

        /**
         * NoiseMessage content.
         * @member {Uint8Array} content
         * @memberof web.NoiseMessage
         * @instance
         */
        NoiseMessage.prototype.content = $util.newBuffer([]);

        /**
         * Creates a new NoiseMessage instance using the specified properties.
         * @function create
         * @memberof web.NoiseMessage
         * @static
         * @param {web.INoiseMessage=} [properties] Properties to set
         * @returns {web.NoiseMessage} NoiseMessage instance
         */
        NoiseMessage.create = function create(properties) {
            return new NoiseMessage(properties);
        };

        /**
         * Encodes the specified NoiseMessage message. Does not implicitly {@link web.NoiseMessage.verify|verify} messages.
         * @function encode
         * @memberof web.NoiseMessage
         * @static
         * @param {web.INoiseMessage} message NoiseMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NoiseMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.messageType != null && Object.hasOwnProperty.call(message, "messageType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.messageType);
            if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.content);
            return writer;
        };

        /**
         * Encodes the specified NoiseMessage message, length delimited. Does not implicitly {@link web.NoiseMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof web.NoiseMessage
         * @static
         * @param {web.INoiseMessage} message NoiseMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NoiseMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a NoiseMessage message from the specified reader or buffer.
         * @function decode
         * @memberof web.NoiseMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {web.NoiseMessage} NoiseMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NoiseMessage.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.web.NoiseMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.messageType = reader.int32();
                    break;
                case 2:
                    message.content = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a NoiseMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof web.NoiseMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {web.NoiseMessage} NoiseMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NoiseMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NoiseMessage message.
         * @function verify
         * @memberof web.NoiseMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NoiseMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.messageType != null && message.hasOwnProperty("messageType"))
                switch (message.messageType) {
                default:
                    return "messageType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.content != null && message.hasOwnProperty("content"))
                if (!(message.content && typeof message.content.length === "number" || $util.isString(message.content)))
                    return "content: buffer expected";
            return null;
        };

        /**
         * Creates a NoiseMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof web.NoiseMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {web.NoiseMessage} NoiseMessage
         */
        NoiseMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.web.NoiseMessage)
                return object;
            let message = new $root.web.NoiseMessage();
            switch (object.messageType) {
            case "IK_A":
            case 0:
                message.messageType = 0;
                break;
            case "IK_B":
            case 1:
                message.messageType = 1;
                break;
            case "KK_A":
            case 2:
                message.messageType = 2;
                break;
            case "KK_B":
            case 3:
                message.messageType = 3;
                break;
            }
            if (object.content != null)
                if (typeof object.content === "string")
                    $util.base64.decode(object.content, message.content = $util.newBuffer($util.base64.length(object.content)), 0);
                else if (object.content.length)
                    message.content = object.content;
            return message;
        };

        /**
         * Creates a plain object from a NoiseMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof web.NoiseMessage
         * @static
         * @param {web.NoiseMessage} message NoiseMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NoiseMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.messageType = options.enums === String ? "IK_A" : 0;
                if (options.bytes === String)
                    object.content = "";
                else {
                    object.content = [];
                    if (options.bytes !== Array)
                        object.content = $util.newBuffer(object.content);
                }
            }
            if (message.messageType != null && message.hasOwnProperty("messageType"))
                object.messageType = options.enums === String ? $root.web.NoiseMessage.MessageType[message.messageType] : message.messageType;
            if (message.content != null && message.hasOwnProperty("content"))
                object.content = options.bytes === String ? $util.base64.encode(message.content, 0, message.content.length) : options.bytes === Array ? Array.prototype.slice.call(message.content) : message.content;
            return object;
        };

        /**
         * Converts this NoiseMessage to JSON.
         * @function toJSON
         * @memberof web.NoiseMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NoiseMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * MessageType enum.
         * @name web.NoiseMessage.MessageType
         * @enum {number}
         * @property {number} IK_A=0 IK_A value
         * @property {number} IK_B=1 IK_B value
         * @property {number} KK_A=2 KK_A value
         * @property {number} KK_B=3 KK_B value
         */
        NoiseMessage.MessageType = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "IK_A"] = 0;
            values[valuesById[1] = "IK_B"] = 1;
            values[valuesById[2] = "KK_A"] = 2;
            values[valuesById[3] = "KK_B"] = 3;
            return values;
        })();

        return NoiseMessage;
    })();

    return web;
})();

export { $root as default };
