/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const clients = $root.clients = (() => {

    /**
     * Namespace clients.
     * @exports clients
     * @namespace
     */
    const clients = {};

    /**
     * MediaType enum.
     * @name clients.MediaType
     * @enum {number}
     * @property {number} MEDIA_TYPE_UNSPECIFIED=0 MEDIA_TYPE_UNSPECIFIED value
     * @property {number} MEDIA_TYPE_IMAGE=1 MEDIA_TYPE_IMAGE value
     * @property {number} MEDIA_TYPE_VIDEO=2 MEDIA_TYPE_VIDEO value
     * @property {number} MEDIA_TYPE_AUDIO=3 MEDIA_TYPE_AUDIO value
     */
    clients.MediaType = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "MEDIA_TYPE_UNSPECIFIED"] = 0;
        values[valuesById[1] = "MEDIA_TYPE_IMAGE"] = 1;
        values[valuesById[2] = "MEDIA_TYPE_VIDEO"] = 2;
        values[valuesById[3] = "MEDIA_TYPE_AUDIO"] = 3;
        return values;
    })();

    /**
     * BlobVersion enum.
     * @name clients.BlobVersion
     * @enum {number}
     * @property {number} BLOB_VERSION_DEFAULT=0 BLOB_VERSION_DEFAULT value
     * @property {number} BLOB_VERSION_CHUNKED=1 BLOB_VERSION_CHUNKED value
     */
    clients.BlobVersion = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "BLOB_VERSION_DEFAULT"] = 0;
        values[valuesById[1] = "BLOB_VERSION_CHUNKED"] = 1;
        return values;
    })();

    clients.Media = (function() {

        /**
         * Properties of a Media.
         * @memberof clients
         * @interface IMedia
         * @property {clients.MediaType|null} [type] Media type
         * @property {number|null} [width] Media width
         * @property {number|null} [height] Media height
         * @property {Uint8Array|null} [encryptionKey] Media encryptionKey
         * @property {Uint8Array|null} [ciphertextHash] Media ciphertextHash
         * @property {string|null} [downloadUrl] Media downloadUrl
         * @property {clients.BlobVersion|null} [blobVersion] Media blobVersion
         * @property {number|null} [chunkSize] Media chunkSize
         * @property {number|Long|null} [blobSize] Media blobSize
         */

        /**
         * Constructs a new Media.
         * @memberof clients
         * @classdesc Represents a Media.
         * @implements IMedia
         * @constructor
         * @param {clients.IMedia=} [properties] Properties to set
         */
        function Media(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Media type.
         * @member {clients.MediaType} type
         * @memberof clients.Media
         * @instance
         */
        Media.prototype.type = 0;

        /**
         * Media width.
         * @member {number} width
         * @memberof clients.Media
         * @instance
         */
        Media.prototype.width = 0;

        /**
         * Media height.
         * @member {number} height
         * @memberof clients.Media
         * @instance
         */
        Media.prototype.height = 0;

        /**
         * Media encryptionKey.
         * @member {Uint8Array} encryptionKey
         * @memberof clients.Media
         * @instance
         */
        Media.prototype.encryptionKey = $util.newBuffer([]);

        /**
         * Media ciphertextHash.
         * @member {Uint8Array} ciphertextHash
         * @memberof clients.Media
         * @instance
         */
        Media.prototype.ciphertextHash = $util.newBuffer([]);

        /**
         * Media downloadUrl.
         * @member {string} downloadUrl
         * @memberof clients.Media
         * @instance
         */
        Media.prototype.downloadUrl = "";

        /**
         * Media blobVersion.
         * @member {clients.BlobVersion} blobVersion
         * @memberof clients.Media
         * @instance
         */
        Media.prototype.blobVersion = 0;

        /**
         * Media chunkSize.
         * @member {number} chunkSize
         * @memberof clients.Media
         * @instance
         */
        Media.prototype.chunkSize = 0;

        /**
         * Media blobSize.
         * @member {number|Long} blobSize
         * @memberof clients.Media
         * @instance
         */
        Media.prototype.blobSize = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new Media instance using the specified properties.
         * @function create
         * @memberof clients.Media
         * @static
         * @param {clients.IMedia=} [properties] Properties to set
         * @returns {clients.Media} Media instance
         */
        Media.create = function create(properties) {
            return new Media(properties);
        };

        /**
         * Encodes the specified Media message. Does not implicitly {@link clients.Media.verify|verify} messages.
         * @function encode
         * @memberof clients.Media
         * @static
         * @param {clients.IMedia} message Media message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Media.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.width);
            if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.height);
            if (message.encryptionKey != null && Object.hasOwnProperty.call(message, "encryptionKey"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.encryptionKey);
            if (message.ciphertextHash != null && Object.hasOwnProperty.call(message, "ciphertextHash"))
                writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.ciphertextHash);
            if (message.downloadUrl != null && Object.hasOwnProperty.call(message, "downloadUrl"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.downloadUrl);
            if (message.blobVersion != null && Object.hasOwnProperty.call(message, "blobVersion"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.blobVersion);
            if (message.chunkSize != null && Object.hasOwnProperty.call(message, "chunkSize"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.chunkSize);
            if (message.blobSize != null && Object.hasOwnProperty.call(message, "blobSize"))
                writer.uint32(/* id 9, wireType 0 =*/72).int64(message.blobSize);
            return writer;
        };

        /**
         * Encodes the specified Media message, length delimited. Does not implicitly {@link clients.Media.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.Media
         * @static
         * @param {clients.IMedia} message Media message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Media.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Media message from the specified reader or buffer.
         * @function decode
         * @memberof clients.Media
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.Media} Media
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Media.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.Media();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.width = reader.int32();
                    break;
                case 3:
                    message.height = reader.int32();
                    break;
                case 4:
                    message.encryptionKey = reader.bytes();
                    break;
                case 5:
                    message.ciphertextHash = reader.bytes();
                    break;
                case 6:
                    message.downloadUrl = reader.string();
                    break;
                case 7:
                    message.blobVersion = reader.int32();
                    break;
                case 8:
                    message.chunkSize = reader.int32();
                    break;
                case 9:
                    message.blobSize = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Media message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.Media
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.Media} Media
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Media.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Media message.
         * @function verify
         * @memberof clients.Media
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Media.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            if (message.encryptionKey != null && message.hasOwnProperty("encryptionKey"))
                if (!(message.encryptionKey && typeof message.encryptionKey.length === "number" || $util.isString(message.encryptionKey)))
                    return "encryptionKey: buffer expected";
            if (message.ciphertextHash != null && message.hasOwnProperty("ciphertextHash"))
                if (!(message.ciphertextHash && typeof message.ciphertextHash.length === "number" || $util.isString(message.ciphertextHash)))
                    return "ciphertextHash: buffer expected";
            if (message.downloadUrl != null && message.hasOwnProperty("downloadUrl"))
                if (!$util.isString(message.downloadUrl))
                    return "downloadUrl: string expected";
            if (message.blobVersion != null && message.hasOwnProperty("blobVersion"))
                switch (message.blobVersion) {
                default:
                    return "blobVersion: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.chunkSize != null && message.hasOwnProperty("chunkSize"))
                if (!$util.isInteger(message.chunkSize))
                    return "chunkSize: integer expected";
            if (message.blobSize != null && message.hasOwnProperty("blobSize"))
                if (!$util.isInteger(message.blobSize) && !(message.blobSize && $util.isInteger(message.blobSize.low) && $util.isInteger(message.blobSize.high)))
                    return "blobSize: integer|Long expected";
            return null;
        };

        /**
         * Creates a Media message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.Media
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.Media} Media
         */
        Media.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.Media)
                return object;
            let message = new $root.clients.Media();
            switch (object.type) {
            case "MEDIA_TYPE_UNSPECIFIED":
            case 0:
                message.type = 0;
                break;
            case "MEDIA_TYPE_IMAGE":
            case 1:
                message.type = 1;
                break;
            case "MEDIA_TYPE_VIDEO":
            case 2:
                message.type = 2;
                break;
            case "MEDIA_TYPE_AUDIO":
            case 3:
                message.type = 3;
                break;
            }
            if (object.width != null)
                message.width = object.width | 0;
            if (object.height != null)
                message.height = object.height | 0;
            if (object.encryptionKey != null)
                if (typeof object.encryptionKey === "string")
                    $util.base64.decode(object.encryptionKey, message.encryptionKey = $util.newBuffer($util.base64.length(object.encryptionKey)), 0);
                else if (object.encryptionKey.length)
                    message.encryptionKey = object.encryptionKey;
            if (object.ciphertextHash != null)
                if (typeof object.ciphertextHash === "string")
                    $util.base64.decode(object.ciphertextHash, message.ciphertextHash = $util.newBuffer($util.base64.length(object.ciphertextHash)), 0);
                else if (object.ciphertextHash.length)
                    message.ciphertextHash = object.ciphertextHash;
            if (object.downloadUrl != null)
                message.downloadUrl = String(object.downloadUrl);
            switch (object.blobVersion) {
            case "BLOB_VERSION_DEFAULT":
            case 0:
                message.blobVersion = 0;
                break;
            case "BLOB_VERSION_CHUNKED":
            case 1:
                message.blobVersion = 1;
                break;
            }
            if (object.chunkSize != null)
                message.chunkSize = object.chunkSize | 0;
            if (object.blobSize != null)
                if ($util.Long)
                    (message.blobSize = $util.Long.fromValue(object.blobSize)).unsigned = false;
                else if (typeof object.blobSize === "string")
                    message.blobSize = parseInt(object.blobSize, 10);
                else if (typeof object.blobSize === "number")
                    message.blobSize = object.blobSize;
                else if (typeof object.blobSize === "object")
                    message.blobSize = new $util.LongBits(object.blobSize.low >>> 0, object.blobSize.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a Media message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.Media
         * @static
         * @param {clients.Media} message Media
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Media.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.type = options.enums === String ? "MEDIA_TYPE_UNSPECIFIED" : 0;
                object.width = 0;
                object.height = 0;
                if (options.bytes === String)
                    object.encryptionKey = "";
                else {
                    object.encryptionKey = [];
                    if (options.bytes !== Array)
                        object.encryptionKey = $util.newBuffer(object.encryptionKey);
                }
                if (options.bytes === String)
                    object.ciphertextHash = "";
                else {
                    object.ciphertextHash = [];
                    if (options.bytes !== Array)
                        object.ciphertextHash = $util.newBuffer(object.ciphertextHash);
                }
                object.downloadUrl = "";
                object.blobVersion = options.enums === String ? "BLOB_VERSION_DEFAULT" : 0;
                object.chunkSize = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.blobSize = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.blobSize = options.longs === String ? "0" : 0;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.clients.MediaType[message.type] : message.type;
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            if (message.encryptionKey != null && message.hasOwnProperty("encryptionKey"))
                object.encryptionKey = options.bytes === String ? $util.base64.encode(message.encryptionKey, 0, message.encryptionKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.encryptionKey) : message.encryptionKey;
            if (message.ciphertextHash != null && message.hasOwnProperty("ciphertextHash"))
                object.ciphertextHash = options.bytes === String ? $util.base64.encode(message.ciphertextHash, 0, message.ciphertextHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.ciphertextHash) : message.ciphertextHash;
            if (message.downloadUrl != null && message.hasOwnProperty("downloadUrl"))
                object.downloadUrl = message.downloadUrl;
            if (message.blobVersion != null && message.hasOwnProperty("blobVersion"))
                object.blobVersion = options.enums === String ? $root.clients.BlobVersion[message.blobVersion] : message.blobVersion;
            if (message.chunkSize != null && message.hasOwnProperty("chunkSize"))
                object.chunkSize = message.chunkSize;
            if (message.blobSize != null && message.hasOwnProperty("blobSize"))
                if (typeof message.blobSize === "number")
                    object.blobSize = options.longs === String ? String(message.blobSize) : message.blobSize;
                else
                    object.blobSize = options.longs === String ? $util.Long.prototype.toString.call(message.blobSize) : options.longs === Number ? new $util.LongBits(message.blobSize.low >>> 0, message.blobSize.high >>> 0).toNumber() : message.blobSize;
            return object;
        };

        /**
         * Converts this Media to JSON.
         * @function toJSON
         * @memberof clients.Media
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Media.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Media;
    })();

    clients.EncryptedResource = (function() {

        /**
         * Properties of an EncryptedResource.
         * @memberof clients
         * @interface IEncryptedResource
         * @property {Uint8Array|null} [encryptionKey] EncryptedResource encryptionKey
         * @property {Uint8Array|null} [ciphertextHash] EncryptedResource ciphertextHash
         * @property {string|null} [downloadUrl] EncryptedResource downloadUrl
         */

        /**
         * Constructs a new EncryptedResource.
         * @memberof clients
         * @classdesc Represents an EncryptedResource.
         * @implements IEncryptedResource
         * @constructor
         * @param {clients.IEncryptedResource=} [properties] Properties to set
         */
        function EncryptedResource(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EncryptedResource encryptionKey.
         * @member {Uint8Array} encryptionKey
         * @memberof clients.EncryptedResource
         * @instance
         */
        EncryptedResource.prototype.encryptionKey = $util.newBuffer([]);

        /**
         * EncryptedResource ciphertextHash.
         * @member {Uint8Array} ciphertextHash
         * @memberof clients.EncryptedResource
         * @instance
         */
        EncryptedResource.prototype.ciphertextHash = $util.newBuffer([]);

        /**
         * EncryptedResource downloadUrl.
         * @member {string} downloadUrl
         * @memberof clients.EncryptedResource
         * @instance
         */
        EncryptedResource.prototype.downloadUrl = "";

        /**
         * Creates a new EncryptedResource instance using the specified properties.
         * @function create
         * @memberof clients.EncryptedResource
         * @static
         * @param {clients.IEncryptedResource=} [properties] Properties to set
         * @returns {clients.EncryptedResource} EncryptedResource instance
         */
        EncryptedResource.create = function create(properties) {
            return new EncryptedResource(properties);
        };

        /**
         * Encodes the specified EncryptedResource message. Does not implicitly {@link clients.EncryptedResource.verify|verify} messages.
         * @function encode
         * @memberof clients.EncryptedResource
         * @static
         * @param {clients.IEncryptedResource} message EncryptedResource message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EncryptedResource.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.encryptionKey != null && Object.hasOwnProperty.call(message, "encryptionKey"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.encryptionKey);
            if (message.ciphertextHash != null && Object.hasOwnProperty.call(message, "ciphertextHash"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.ciphertextHash);
            if (message.downloadUrl != null && Object.hasOwnProperty.call(message, "downloadUrl"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.downloadUrl);
            return writer;
        };

        /**
         * Encodes the specified EncryptedResource message, length delimited. Does not implicitly {@link clients.EncryptedResource.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.EncryptedResource
         * @static
         * @param {clients.IEncryptedResource} message EncryptedResource message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EncryptedResource.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EncryptedResource message from the specified reader or buffer.
         * @function decode
         * @memberof clients.EncryptedResource
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.EncryptedResource} EncryptedResource
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EncryptedResource.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.EncryptedResource();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.encryptionKey = reader.bytes();
                    break;
                case 2:
                    message.ciphertextHash = reader.bytes();
                    break;
                case 3:
                    message.downloadUrl = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EncryptedResource message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.EncryptedResource
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.EncryptedResource} EncryptedResource
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EncryptedResource.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EncryptedResource message.
         * @function verify
         * @memberof clients.EncryptedResource
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EncryptedResource.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.encryptionKey != null && message.hasOwnProperty("encryptionKey"))
                if (!(message.encryptionKey && typeof message.encryptionKey.length === "number" || $util.isString(message.encryptionKey)))
                    return "encryptionKey: buffer expected";
            if (message.ciphertextHash != null && message.hasOwnProperty("ciphertextHash"))
                if (!(message.ciphertextHash && typeof message.ciphertextHash.length === "number" || $util.isString(message.ciphertextHash)))
                    return "ciphertextHash: buffer expected";
            if (message.downloadUrl != null && message.hasOwnProperty("downloadUrl"))
                if (!$util.isString(message.downloadUrl))
                    return "downloadUrl: string expected";
            return null;
        };

        /**
         * Creates an EncryptedResource message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.EncryptedResource
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.EncryptedResource} EncryptedResource
         */
        EncryptedResource.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.EncryptedResource)
                return object;
            let message = new $root.clients.EncryptedResource();
            if (object.encryptionKey != null)
                if (typeof object.encryptionKey === "string")
                    $util.base64.decode(object.encryptionKey, message.encryptionKey = $util.newBuffer($util.base64.length(object.encryptionKey)), 0);
                else if (object.encryptionKey.length)
                    message.encryptionKey = object.encryptionKey;
            if (object.ciphertextHash != null)
                if (typeof object.ciphertextHash === "string")
                    $util.base64.decode(object.ciphertextHash, message.ciphertextHash = $util.newBuffer($util.base64.length(object.ciphertextHash)), 0);
                else if (object.ciphertextHash.length)
                    message.ciphertextHash = object.ciphertextHash;
            if (object.downloadUrl != null)
                message.downloadUrl = String(object.downloadUrl);
            return message;
        };

        /**
         * Creates a plain object from an EncryptedResource message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.EncryptedResource
         * @static
         * @param {clients.EncryptedResource} message EncryptedResource
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EncryptedResource.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.encryptionKey = "";
                else {
                    object.encryptionKey = [];
                    if (options.bytes !== Array)
                        object.encryptionKey = $util.newBuffer(object.encryptionKey);
                }
                if (options.bytes === String)
                    object.ciphertextHash = "";
                else {
                    object.ciphertextHash = [];
                    if (options.bytes !== Array)
                        object.ciphertextHash = $util.newBuffer(object.ciphertextHash);
                }
                object.downloadUrl = "";
            }
            if (message.encryptionKey != null && message.hasOwnProperty("encryptionKey"))
                object.encryptionKey = options.bytes === String ? $util.base64.encode(message.encryptionKey, 0, message.encryptionKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.encryptionKey) : message.encryptionKey;
            if (message.ciphertextHash != null && message.hasOwnProperty("ciphertextHash"))
                object.ciphertextHash = options.bytes === String ? $util.base64.encode(message.ciphertextHash, 0, message.ciphertextHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.ciphertextHash) : message.ciphertextHash;
            if (message.downloadUrl != null && message.hasOwnProperty("downloadUrl"))
                object.downloadUrl = message.downloadUrl;
            return object;
        };

        /**
         * Converts this EncryptedResource to JSON.
         * @function toJSON
         * @memberof clients.EncryptedResource
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EncryptedResource.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EncryptedResource;
    })();

    clients.Mention = (function() {

        /**
         * Properties of a Mention.
         * @memberof clients
         * @interface IMention
         * @property {number|null} [index] Mention index
         * @property {string|null} [userId] Mention userId
         * @property {string|null} [name] Mention name
         */

        /**
         * Constructs a new Mention.
         * @memberof clients
         * @classdesc Represents a Mention.
         * @implements IMention
         * @constructor
         * @param {clients.IMention=} [properties] Properties to set
         */
        function Mention(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Mention index.
         * @member {number} index
         * @memberof clients.Mention
         * @instance
         */
        Mention.prototype.index = 0;

        /**
         * Mention userId.
         * @member {string} userId
         * @memberof clients.Mention
         * @instance
         */
        Mention.prototype.userId = "";

        /**
         * Mention name.
         * @member {string} name
         * @memberof clients.Mention
         * @instance
         */
        Mention.prototype.name = "";

        /**
         * Creates a new Mention instance using the specified properties.
         * @function create
         * @memberof clients.Mention
         * @static
         * @param {clients.IMention=} [properties] Properties to set
         * @returns {clients.Mention} Mention instance
         */
        Mention.create = function create(properties) {
            return new Mention(properties);
        };

        /**
         * Encodes the specified Mention message. Does not implicitly {@link clients.Mention.verify|verify} messages.
         * @function encode
         * @memberof clients.Mention
         * @static
         * @param {clients.IMention} message Mention message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Mention.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.index != null && Object.hasOwnProperty.call(message, "index"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.index);
            if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.userId);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.name);
            return writer;
        };

        /**
         * Encodes the specified Mention message, length delimited. Does not implicitly {@link clients.Mention.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.Mention
         * @static
         * @param {clients.IMention} message Mention message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Mention.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Mention message from the specified reader or buffer.
         * @function decode
         * @memberof clients.Mention
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.Mention} Mention
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Mention.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.Mention();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.index = reader.int32();
                    break;
                case 2:
                    message.userId = reader.string();
                    break;
                case 3:
                    message.name = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Mention message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.Mention
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.Mention} Mention
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Mention.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Mention message.
         * @function verify
         * @memberof clients.Mention
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Mention.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.index != null && message.hasOwnProperty("index"))
                if (!$util.isInteger(message.index))
                    return "index: integer expected";
            if (message.userId != null && message.hasOwnProperty("userId"))
                if (!$util.isString(message.userId))
                    return "userId: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            return null;
        };

        /**
         * Creates a Mention message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.Mention
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.Mention} Mention
         */
        Mention.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.Mention)
                return object;
            let message = new $root.clients.Mention();
            if (object.index != null)
                message.index = object.index | 0;
            if (object.userId != null)
                message.userId = String(object.userId);
            if (object.name != null)
                message.name = String(object.name);
            return message;
        };

        /**
         * Creates a plain object from a Mention message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.Mention
         * @static
         * @param {clients.Mention} message Mention
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Mention.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.index = 0;
                object.userId = "";
                object.name = "";
            }
            if (message.index != null && message.hasOwnProperty("index"))
                object.index = message.index;
            if (message.userId != null && message.hasOwnProperty("userId"))
                object.userId = message.userId;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            return object;
        };

        /**
         * Converts this Mention to JSON.
         * @function toJSON
         * @memberof clients.Mention
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Mention.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Mention;
    })();

    /**
     * PhoneType enum.
     * @name clients.PhoneType
     * @enum {number}
     * @property {number} PHONE_TYPE_UNSPECIFIED=0 PHONE_TYPE_UNSPECIFIED value
     * @property {number} PHONE_TYPE_MOBILE=1 PHONE_TYPE_MOBILE value
     * @property {number} PHONE_TYPE_HOME=2 PHONE_TYPE_HOME value
     * @property {number} PHONE_TYPE_WORK=3 PHONE_TYPE_WORK value
     */
    clients.PhoneType = (function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "PHONE_TYPE_UNSPECIFIED"] = 0;
        values[valuesById[1] = "PHONE_TYPE_MOBILE"] = 1;
        values[valuesById[2] = "PHONE_TYPE_HOME"] = 2;
        values[valuesById[3] = "PHONE_TYPE_WORK"] = 3;
        return values;
    })();

    clients.Phone = (function() {

        /**
         * Properties of a Phone.
         * @memberof clients
         * @interface IPhone
         * @property {clients.PhoneType|null} [type] Phone type
         * @property {string|null} [number] Phone number
         */

        /**
         * Constructs a new Phone.
         * @memberof clients
         * @classdesc Represents a Phone.
         * @implements IPhone
         * @constructor
         * @param {clients.IPhone=} [properties] Properties to set
         */
        function Phone(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Phone type.
         * @member {clients.PhoneType} type
         * @memberof clients.Phone
         * @instance
         */
        Phone.prototype.type = 0;

        /**
         * Phone number.
         * @member {string} number
         * @memberof clients.Phone
         * @instance
         */
        Phone.prototype.number = "";

        /**
         * Creates a new Phone instance using the specified properties.
         * @function create
         * @memberof clients.Phone
         * @static
         * @param {clients.IPhone=} [properties] Properties to set
         * @returns {clients.Phone} Phone instance
         */
        Phone.create = function create(properties) {
            return new Phone(properties);
        };

        /**
         * Encodes the specified Phone message. Does not implicitly {@link clients.Phone.verify|verify} messages.
         * @function encode
         * @memberof clients.Phone
         * @static
         * @param {clients.IPhone} message Phone message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Phone.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
            if (message.number != null && Object.hasOwnProperty.call(message, "number"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.number);
            return writer;
        };

        /**
         * Encodes the specified Phone message, length delimited. Does not implicitly {@link clients.Phone.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.Phone
         * @static
         * @param {clients.IPhone} message Phone message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Phone.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Phone message from the specified reader or buffer.
         * @function decode
         * @memberof clients.Phone
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.Phone} Phone
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Phone.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.Phone();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.type = reader.int32();
                    break;
                case 2:
                    message.number = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Phone message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.Phone
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.Phone} Phone
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Phone.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Phone message.
         * @function verify
         * @memberof clients.Phone
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Phone.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.number != null && message.hasOwnProperty("number"))
                if (!$util.isString(message.number))
                    return "number: string expected";
            return null;
        };

        /**
         * Creates a Phone message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.Phone
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.Phone} Phone
         */
        Phone.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.Phone)
                return object;
            let message = new $root.clients.Phone();
            switch (object.type) {
            case "PHONE_TYPE_UNSPECIFIED":
            case 0:
                message.type = 0;
                break;
            case "PHONE_TYPE_MOBILE":
            case 1:
                message.type = 1;
                break;
            case "PHONE_TYPE_HOME":
            case 2:
                message.type = 2;
                break;
            case "PHONE_TYPE_WORK":
            case 3:
                message.type = 3;
                break;
            }
            if (object.number != null)
                message.number = String(object.number);
            return message;
        };

        /**
         * Creates a plain object from a Phone message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.Phone
         * @static
         * @param {clients.Phone} message Phone
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Phone.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.type = options.enums === String ? "PHONE_TYPE_UNSPECIFIED" : 0;
                object.number = "";
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.clients.PhoneType[message.type] : message.type;
            if (message.number != null && message.hasOwnProperty("number"))
                object.number = message.number;
            return object;
        };

        /**
         * Converts this Phone to JSON.
         * @function toJSON
         * @memberof clients.Phone
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Phone.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Phone;
    })();

    clients.Contact = (function() {

        /**
         * Properties of a Contact.
         * @memberof clients
         * @interface IContact
         * @property {string|null} [name] Contact name
         * @property {Array.<clients.IPhone>|null} [phones] Contact phones
         */

        /**
         * Constructs a new Contact.
         * @memberof clients
         * @classdesc Represents a Contact.
         * @implements IContact
         * @constructor
         * @param {clients.IContact=} [properties] Properties to set
         */
        function Contact(properties) {
            this.phones = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Contact name.
         * @member {string} name
         * @memberof clients.Contact
         * @instance
         */
        Contact.prototype.name = "";

        /**
         * Contact phones.
         * @member {Array.<clients.IPhone>} phones
         * @memberof clients.Contact
         * @instance
         */
        Contact.prototype.phones = $util.emptyArray;

        /**
         * Creates a new Contact instance using the specified properties.
         * @function create
         * @memberof clients.Contact
         * @static
         * @param {clients.IContact=} [properties] Properties to set
         * @returns {clients.Contact} Contact instance
         */
        Contact.create = function create(properties) {
            return new Contact(properties);
        };

        /**
         * Encodes the specified Contact message. Does not implicitly {@link clients.Contact.verify|verify} messages.
         * @function encode
         * @memberof clients.Contact
         * @static
         * @param {clients.IContact} message Contact message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Contact.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.phones != null && message.phones.length)
                for (let i = 0; i < message.phones.length; ++i)
                    $root.clients.Phone.encode(message.phones[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Contact message, length delimited. Does not implicitly {@link clients.Contact.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.Contact
         * @static
         * @param {clients.IContact} message Contact message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Contact.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Contact message from the specified reader or buffer.
         * @function decode
         * @memberof clients.Contact
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.Contact} Contact
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Contact.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.Contact();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    if (!(message.phones && message.phones.length))
                        message.phones = [];
                    message.phones.push($root.clients.Phone.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Contact message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.Contact
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.Contact} Contact
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Contact.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Contact message.
         * @function verify
         * @memberof clients.Contact
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Contact.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.phones != null && message.hasOwnProperty("phones")) {
                if (!Array.isArray(message.phones))
                    return "phones: array expected";
                for (let i = 0; i < message.phones.length; ++i) {
                    let error = $root.clients.Phone.verify(message.phones[i]);
                    if (error)
                        return "phones." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Contact message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.Contact
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.Contact} Contact
         */
        Contact.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.Contact)
                return object;
            let message = new $root.clients.Contact();
            if (object.name != null)
                message.name = String(object.name);
            if (object.phones) {
                if (!Array.isArray(object.phones))
                    throw TypeError(".clients.Contact.phones: array expected");
                message.phones = [];
                for (let i = 0; i < object.phones.length; ++i) {
                    if (typeof object.phones[i] !== "object")
                        throw TypeError(".clients.Contact.phones: object expected");
                    message.phones[i] = $root.clients.Phone.fromObject(object.phones[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Contact message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.Contact
         * @static
         * @param {clients.Contact} message Contact
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Contact.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.phones = [];
            if (options.defaults)
                object.name = "";
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.phones && message.phones.length) {
                object.phones = [];
                for (let j = 0; j < message.phones.length; ++j)
                    object.phones[j] = $root.clients.Phone.toObject(message.phones[j], options);
            }
            return object;
        };

        /**
         * Converts this Contact to JSON.
         * @function toJSON
         * @memberof clients.Contact
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Contact.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Contact;
    })();

    clients.SignedPreKey = (function() {

        /**
         * Properties of a SignedPreKey.
         * @memberof clients
         * @interface ISignedPreKey
         * @property {number|null} [id] SignedPreKey id
         * @property {Uint8Array|null} [publicKey] SignedPreKey publicKey
         * @property {Uint8Array|null} [signature] SignedPreKey signature
         */

        /**
         * Constructs a new SignedPreKey.
         * @memberof clients
         * @classdesc Represents a SignedPreKey.
         * @implements ISignedPreKey
         * @constructor
         * @param {clients.ISignedPreKey=} [properties] Properties to set
         */
        function SignedPreKey(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SignedPreKey id.
         * @member {number} id
         * @memberof clients.SignedPreKey
         * @instance
         */
        SignedPreKey.prototype.id = 0;

        /**
         * SignedPreKey publicKey.
         * @member {Uint8Array} publicKey
         * @memberof clients.SignedPreKey
         * @instance
         */
        SignedPreKey.prototype.publicKey = $util.newBuffer([]);

        /**
         * SignedPreKey signature.
         * @member {Uint8Array} signature
         * @memberof clients.SignedPreKey
         * @instance
         */
        SignedPreKey.prototype.signature = $util.newBuffer([]);

        /**
         * Creates a new SignedPreKey instance using the specified properties.
         * @function create
         * @memberof clients.SignedPreKey
         * @static
         * @param {clients.ISignedPreKey=} [properties] Properties to set
         * @returns {clients.SignedPreKey} SignedPreKey instance
         */
        SignedPreKey.create = function create(properties) {
            return new SignedPreKey(properties);
        };

        /**
         * Encodes the specified SignedPreKey message. Does not implicitly {@link clients.SignedPreKey.verify|verify} messages.
         * @function encode
         * @memberof clients.SignedPreKey
         * @static
         * @param {clients.ISignedPreKey} message SignedPreKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SignedPreKey.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.publicKey != null && Object.hasOwnProperty.call(message, "publicKey"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.publicKey);
            if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.signature);
            return writer;
        };

        /**
         * Encodes the specified SignedPreKey message, length delimited. Does not implicitly {@link clients.SignedPreKey.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.SignedPreKey
         * @static
         * @param {clients.ISignedPreKey} message SignedPreKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SignedPreKey.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SignedPreKey message from the specified reader or buffer.
         * @function decode
         * @memberof clients.SignedPreKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.SignedPreKey} SignedPreKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SignedPreKey.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.SignedPreKey();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.int32();
                    break;
                case 2:
                    message.publicKey = reader.bytes();
                    break;
                case 3:
                    message.signature = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SignedPreKey message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.SignedPreKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.SignedPreKey} SignedPreKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SignedPreKey.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SignedPreKey message.
         * @function verify
         * @memberof clients.SignedPreKey
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SignedPreKey.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                if (!(message.publicKey && typeof message.publicKey.length === "number" || $util.isString(message.publicKey)))
                    return "publicKey: buffer expected";
            if (message.signature != null && message.hasOwnProperty("signature"))
                if (!(message.signature && typeof message.signature.length === "number" || $util.isString(message.signature)))
                    return "signature: buffer expected";
            return null;
        };

        /**
         * Creates a SignedPreKey message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.SignedPreKey
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.SignedPreKey} SignedPreKey
         */
        SignedPreKey.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.SignedPreKey)
                return object;
            let message = new $root.clients.SignedPreKey();
            if (object.id != null)
                message.id = object.id | 0;
            if (object.publicKey != null)
                if (typeof object.publicKey === "string")
                    $util.base64.decode(object.publicKey, message.publicKey = $util.newBuffer($util.base64.length(object.publicKey)), 0);
                else if (object.publicKey.length)
                    message.publicKey = object.publicKey;
            if (object.signature != null)
                if (typeof object.signature === "string")
                    $util.base64.decode(object.signature, message.signature = $util.newBuffer($util.base64.length(object.signature)), 0);
                else if (object.signature.length)
                    message.signature = object.signature;
            return message;
        };

        /**
         * Creates a plain object from a SignedPreKey message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.SignedPreKey
         * @static
         * @param {clients.SignedPreKey} message SignedPreKey
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SignedPreKey.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = 0;
                if (options.bytes === String)
                    object.publicKey = "";
                else {
                    object.publicKey = [];
                    if (options.bytes !== Array)
                        object.publicKey = $util.newBuffer(object.publicKey);
                }
                if (options.bytes === String)
                    object.signature = "";
                else {
                    object.signature = [];
                    if (options.bytes !== Array)
                        object.signature = $util.newBuffer(object.signature);
                }
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                object.publicKey = options.bytes === String ? $util.base64.encode(message.publicKey, 0, message.publicKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.publicKey) : message.publicKey;
            if (message.signature != null && message.hasOwnProperty("signature"))
                object.signature = options.bytes === String ? $util.base64.encode(message.signature, 0, message.signature.length) : options.bytes === Array ? Array.prototype.slice.call(message.signature) : message.signature;
            return object;
        };

        /**
         * Converts this SignedPreKey to JSON.
         * @function toJSON
         * @memberof clients.SignedPreKey
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SignedPreKey.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SignedPreKey;
    })();

    clients.OneTimePreKey = (function() {

        /**
         * Properties of an OneTimePreKey.
         * @memberof clients
         * @interface IOneTimePreKey
         * @property {number|null} [id] OneTimePreKey id
         * @property {Uint8Array|null} [publicKey] OneTimePreKey publicKey
         */

        /**
         * Constructs a new OneTimePreKey.
         * @memberof clients
         * @classdesc Represents an OneTimePreKey.
         * @implements IOneTimePreKey
         * @constructor
         * @param {clients.IOneTimePreKey=} [properties] Properties to set
         */
        function OneTimePreKey(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * OneTimePreKey id.
         * @member {number} id
         * @memberof clients.OneTimePreKey
         * @instance
         */
        OneTimePreKey.prototype.id = 0;

        /**
         * OneTimePreKey publicKey.
         * @member {Uint8Array} publicKey
         * @memberof clients.OneTimePreKey
         * @instance
         */
        OneTimePreKey.prototype.publicKey = $util.newBuffer([]);

        /**
         * Creates a new OneTimePreKey instance using the specified properties.
         * @function create
         * @memberof clients.OneTimePreKey
         * @static
         * @param {clients.IOneTimePreKey=} [properties] Properties to set
         * @returns {clients.OneTimePreKey} OneTimePreKey instance
         */
        OneTimePreKey.create = function create(properties) {
            return new OneTimePreKey(properties);
        };

        /**
         * Encodes the specified OneTimePreKey message. Does not implicitly {@link clients.OneTimePreKey.verify|verify} messages.
         * @function encode
         * @memberof clients.OneTimePreKey
         * @static
         * @param {clients.IOneTimePreKey} message OneTimePreKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OneTimePreKey.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.id);
            if (message.publicKey != null && Object.hasOwnProperty.call(message, "publicKey"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.publicKey);
            return writer;
        };

        /**
         * Encodes the specified OneTimePreKey message, length delimited. Does not implicitly {@link clients.OneTimePreKey.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.OneTimePreKey
         * @static
         * @param {clients.IOneTimePreKey} message OneTimePreKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        OneTimePreKey.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an OneTimePreKey message from the specified reader or buffer.
         * @function decode
         * @memberof clients.OneTimePreKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.OneTimePreKey} OneTimePreKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OneTimePreKey.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.OneTimePreKey();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.int32();
                    break;
                case 2:
                    message.publicKey = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an OneTimePreKey message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.OneTimePreKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.OneTimePreKey} OneTimePreKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        OneTimePreKey.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an OneTimePreKey message.
         * @function verify
         * @memberof clients.OneTimePreKey
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        OneTimePreKey.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                if (!(message.publicKey && typeof message.publicKey.length === "number" || $util.isString(message.publicKey)))
                    return "publicKey: buffer expected";
            return null;
        };

        /**
         * Creates an OneTimePreKey message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.OneTimePreKey
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.OneTimePreKey} OneTimePreKey
         */
        OneTimePreKey.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.OneTimePreKey)
                return object;
            let message = new $root.clients.OneTimePreKey();
            if (object.id != null)
                message.id = object.id | 0;
            if (object.publicKey != null)
                if (typeof object.publicKey === "string")
                    $util.base64.decode(object.publicKey, message.publicKey = $util.newBuffer($util.base64.length(object.publicKey)), 0);
                else if (object.publicKey.length)
                    message.publicKey = object.publicKey;
            return message;
        };

        /**
         * Creates a plain object from an OneTimePreKey message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.OneTimePreKey
         * @static
         * @param {clients.OneTimePreKey} message OneTimePreKey
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        OneTimePreKey.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = 0;
                if (options.bytes === String)
                    object.publicKey = "";
                else {
                    object.publicKey = [];
                    if (options.bytes !== Array)
                        object.publicKey = $util.newBuffer(object.publicKey);
                }
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.publicKey != null && message.hasOwnProperty("publicKey"))
                object.publicKey = options.bytes === String ? $util.base64.encode(message.publicKey, 0, message.publicKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.publicKey) : message.publicKey;
            return object;
        };

        /**
         * Converts this OneTimePreKey to JSON.
         * @function toJSON
         * @memberof clients.OneTimePreKey
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        OneTimePreKey.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return OneTimePreKey;
    })();

    clients.Background = (function() {

        /**
         * Properties of a Background.
         * @memberof clients
         * @interface IBackground
         * @property {number|null} [theme] Background theme
         */

        /**
         * Constructs a new Background.
         * @memberof clients
         * @classdesc Represents a Background.
         * @implements IBackground
         * @constructor
         * @param {clients.IBackground=} [properties] Properties to set
         */
        function Background(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Background theme.
         * @member {number} theme
         * @memberof clients.Background
         * @instance
         */
        Background.prototype.theme = 0;

        /**
         * Creates a new Background instance using the specified properties.
         * @function create
         * @memberof clients.Background
         * @static
         * @param {clients.IBackground=} [properties] Properties to set
         * @returns {clients.Background} Background instance
         */
        Background.create = function create(properties) {
            return new Background(properties);
        };

        /**
         * Encodes the specified Background message. Does not implicitly {@link clients.Background.verify|verify} messages.
         * @function encode
         * @memberof clients.Background
         * @static
         * @param {clients.IBackground} message Background message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Background.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.theme != null && Object.hasOwnProperty.call(message, "theme"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.theme);
            return writer;
        };

        /**
         * Encodes the specified Background message, length delimited. Does not implicitly {@link clients.Background.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.Background
         * @static
         * @param {clients.IBackground} message Background message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Background.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Background message from the specified reader or buffer.
         * @function decode
         * @memberof clients.Background
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.Background} Background
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Background.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.Background();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.theme = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Background message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.Background
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.Background} Background
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Background.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Background message.
         * @function verify
         * @memberof clients.Background
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Background.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.theme != null && message.hasOwnProperty("theme"))
                if (!$util.isInteger(message.theme))
                    return "theme: integer expected";
            return null;
        };

        /**
         * Creates a Background message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.Background
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.Background} Background
         */
        Background.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.Background)
                return object;
            let message = new $root.clients.Background();
            if (object.theme != null)
                message.theme = object.theme | 0;
            return message;
        };

        /**
         * Creates a plain object from a Background message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.Background
         * @static
         * @param {clients.Background} message Background
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Background.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.theme = 0;
            if (message.theme != null && message.hasOwnProperty("theme"))
                object.theme = message.theme;
            return object;
        };

        /**
         * Converts this Background to JSON.
         * @function toJSON
         * @memberof clients.Background
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Background.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Background;
    })();

    clients.ChatContainer = (function() {

        /**
         * Properties of a ChatContainer.
         * @memberof clients
         * @interface IChatContainer
         * @property {clients.IChatContext|null} [context] ChatContainer context
         * @property {clients.IText|null} [text] ChatContainer text
         * @property {clients.IAlbum|null} [album] ChatContainer album
         * @property {clients.IContactCard|null} [contactCard] ChatContainer contactCard
         * @property {clients.IVoiceNote|null} [voiceNote] ChatContainer voiceNote
         */

        /**
         * Constructs a new ChatContainer.
         * @memberof clients
         * @classdesc Represents a ChatContainer.
         * @implements IChatContainer
         * @constructor
         * @param {clients.IChatContainer=} [properties] Properties to set
         */
        function ChatContainer(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ChatContainer context.
         * @member {clients.IChatContext|null|undefined} context
         * @memberof clients.ChatContainer
         * @instance
         */
        ChatContainer.prototype.context = null;

        /**
         * ChatContainer text.
         * @member {clients.IText|null|undefined} text
         * @memberof clients.ChatContainer
         * @instance
         */
        ChatContainer.prototype.text = null;

        /**
         * ChatContainer album.
         * @member {clients.IAlbum|null|undefined} album
         * @memberof clients.ChatContainer
         * @instance
         */
        ChatContainer.prototype.album = null;

        /**
         * ChatContainer contactCard.
         * @member {clients.IContactCard|null|undefined} contactCard
         * @memberof clients.ChatContainer
         * @instance
         */
        ChatContainer.prototype.contactCard = null;

        /**
         * ChatContainer voiceNote.
         * @member {clients.IVoiceNote|null|undefined} voiceNote
         * @memberof clients.ChatContainer
         * @instance
         */
        ChatContainer.prototype.voiceNote = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * ChatContainer message.
         * @member {"text"|"album"|"contactCard"|"voiceNote"|undefined} message
         * @memberof clients.ChatContainer
         * @instance
         */
        Object.defineProperty(ChatContainer.prototype, "message", {
            get: $util.oneOfGetter($oneOfFields = ["text", "album", "contactCard", "voiceNote"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ChatContainer instance using the specified properties.
         * @function create
         * @memberof clients.ChatContainer
         * @static
         * @param {clients.IChatContainer=} [properties] Properties to set
         * @returns {clients.ChatContainer} ChatContainer instance
         */
        ChatContainer.create = function create(properties) {
            return new ChatContainer(properties);
        };

        /**
         * Encodes the specified ChatContainer message. Does not implicitly {@link clients.ChatContainer.verify|verify} messages.
         * @function encode
         * @memberof clients.ChatContainer
         * @static
         * @param {clients.IChatContainer} message ChatContainer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatContainer.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.context != null && Object.hasOwnProperty.call(message, "context"))
                $root.clients.ChatContext.encode(message.context, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                $root.clients.Text.encode(message.text, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.album != null && Object.hasOwnProperty.call(message, "album"))
                $root.clients.Album.encode(message.album, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.contactCard != null && Object.hasOwnProperty.call(message, "contactCard"))
                $root.clients.ContactCard.encode(message.contactCard, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.voiceNote != null && Object.hasOwnProperty.call(message, "voiceNote"))
                $root.clients.VoiceNote.encode(message.voiceNote, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ChatContainer message, length delimited. Does not implicitly {@link clients.ChatContainer.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.ChatContainer
         * @static
         * @param {clients.IChatContainer} message ChatContainer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatContainer.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ChatContainer message from the specified reader or buffer.
         * @function decode
         * @memberof clients.ChatContainer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.ChatContainer} ChatContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatContainer.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.ChatContainer();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.context = $root.clients.ChatContext.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.text = $root.clients.Text.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.album = $root.clients.Album.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.contactCard = $root.clients.ContactCard.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.voiceNote = $root.clients.VoiceNote.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ChatContainer message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.ChatContainer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.ChatContainer} ChatContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatContainer.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ChatContainer message.
         * @function verify
         * @memberof clients.ChatContainer
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ChatContainer.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.context != null && message.hasOwnProperty("context")) {
                let error = $root.clients.ChatContext.verify(message.context);
                if (error)
                    return "context." + error;
            }
            if (message.text != null && message.hasOwnProperty("text")) {
                properties.message = 1;
                {
                    let error = $root.clients.Text.verify(message.text);
                    if (error)
                        return "text." + error;
                }
            }
            if (message.album != null && message.hasOwnProperty("album")) {
                if (properties.message === 1)
                    return "message: multiple values";
                properties.message = 1;
                {
                    let error = $root.clients.Album.verify(message.album);
                    if (error)
                        return "album." + error;
                }
            }
            if (message.contactCard != null && message.hasOwnProperty("contactCard")) {
                if (properties.message === 1)
                    return "message: multiple values";
                properties.message = 1;
                {
                    let error = $root.clients.ContactCard.verify(message.contactCard);
                    if (error)
                        return "contactCard." + error;
                }
            }
            if (message.voiceNote != null && message.hasOwnProperty("voiceNote")) {
                if (properties.message === 1)
                    return "message: multiple values";
                properties.message = 1;
                {
                    let error = $root.clients.VoiceNote.verify(message.voiceNote);
                    if (error)
                        return "voiceNote." + error;
                }
            }
            return null;
        };

        /**
         * Creates a ChatContainer message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.ChatContainer
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.ChatContainer} ChatContainer
         */
        ChatContainer.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.ChatContainer)
                return object;
            let message = new $root.clients.ChatContainer();
            if (object.context != null) {
                if (typeof object.context !== "object")
                    throw TypeError(".clients.ChatContainer.context: object expected");
                message.context = $root.clients.ChatContext.fromObject(object.context);
            }
            if (object.text != null) {
                if (typeof object.text !== "object")
                    throw TypeError(".clients.ChatContainer.text: object expected");
                message.text = $root.clients.Text.fromObject(object.text);
            }
            if (object.album != null) {
                if (typeof object.album !== "object")
                    throw TypeError(".clients.ChatContainer.album: object expected");
                message.album = $root.clients.Album.fromObject(object.album);
            }
            if (object.contactCard != null) {
                if (typeof object.contactCard !== "object")
                    throw TypeError(".clients.ChatContainer.contactCard: object expected");
                message.contactCard = $root.clients.ContactCard.fromObject(object.contactCard);
            }
            if (object.voiceNote != null) {
                if (typeof object.voiceNote !== "object")
                    throw TypeError(".clients.ChatContainer.voiceNote: object expected");
                message.voiceNote = $root.clients.VoiceNote.fromObject(object.voiceNote);
            }
            return message;
        };

        /**
         * Creates a plain object from a ChatContainer message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.ChatContainer
         * @static
         * @param {clients.ChatContainer} message ChatContainer
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ChatContainer.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.context = null;
            if (message.context != null && message.hasOwnProperty("context"))
                object.context = $root.clients.ChatContext.toObject(message.context, options);
            if (message.text != null && message.hasOwnProperty("text")) {
                object.text = $root.clients.Text.toObject(message.text, options);
                if (options.oneofs)
                    object.message = "text";
            }
            if (message.album != null && message.hasOwnProperty("album")) {
                object.album = $root.clients.Album.toObject(message.album, options);
                if (options.oneofs)
                    object.message = "album";
            }
            if (message.contactCard != null && message.hasOwnProperty("contactCard")) {
                object.contactCard = $root.clients.ContactCard.toObject(message.contactCard, options);
                if (options.oneofs)
                    object.message = "contactCard";
            }
            if (message.voiceNote != null && message.hasOwnProperty("voiceNote")) {
                object.voiceNote = $root.clients.VoiceNote.toObject(message.voiceNote, options);
                if (options.oneofs)
                    object.message = "voiceNote";
            }
            return object;
        };

        /**
         * Converts this ChatContainer to JSON.
         * @function toJSON
         * @memberof clients.ChatContainer
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ChatContainer.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ChatContainer;
    })();

    clients.ChatContext = (function() {

        /**
         * Properties of a ChatContext.
         * @memberof clients
         * @interface IChatContext
         * @property {string|null} [feedPostId] ChatContext feedPostId
         * @property {number|null} [feedPostMediaIndex] ChatContext feedPostMediaIndex
         * @property {string|null} [chatReplyMessageId] ChatContext chatReplyMessageId
         * @property {number|null} [chatReplyMessageMediaIndex] ChatContext chatReplyMessageMediaIndex
         * @property {string|null} [chatReplyMessageSenderId] ChatContext chatReplyMessageSenderId
         */

        /**
         * Constructs a new ChatContext.
         * @memberof clients
         * @classdesc Represents a ChatContext.
         * @implements IChatContext
         * @constructor
         * @param {clients.IChatContext=} [properties] Properties to set
         */
        function ChatContext(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ChatContext feedPostId.
         * @member {string} feedPostId
         * @memberof clients.ChatContext
         * @instance
         */
        ChatContext.prototype.feedPostId = "";

        /**
         * ChatContext feedPostMediaIndex.
         * @member {number} feedPostMediaIndex
         * @memberof clients.ChatContext
         * @instance
         */
        ChatContext.prototype.feedPostMediaIndex = 0;

        /**
         * ChatContext chatReplyMessageId.
         * @member {string} chatReplyMessageId
         * @memberof clients.ChatContext
         * @instance
         */
        ChatContext.prototype.chatReplyMessageId = "";

        /**
         * ChatContext chatReplyMessageMediaIndex.
         * @member {number} chatReplyMessageMediaIndex
         * @memberof clients.ChatContext
         * @instance
         */
        ChatContext.prototype.chatReplyMessageMediaIndex = 0;

        /**
         * ChatContext chatReplyMessageSenderId.
         * @member {string} chatReplyMessageSenderId
         * @memberof clients.ChatContext
         * @instance
         */
        ChatContext.prototype.chatReplyMessageSenderId = "";

        /**
         * Creates a new ChatContext instance using the specified properties.
         * @function create
         * @memberof clients.ChatContext
         * @static
         * @param {clients.IChatContext=} [properties] Properties to set
         * @returns {clients.ChatContext} ChatContext instance
         */
        ChatContext.create = function create(properties) {
            return new ChatContext(properties);
        };

        /**
         * Encodes the specified ChatContext message. Does not implicitly {@link clients.ChatContext.verify|verify} messages.
         * @function encode
         * @memberof clients.ChatContext
         * @static
         * @param {clients.IChatContext} message ChatContext message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatContext.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.feedPostId != null && Object.hasOwnProperty.call(message, "feedPostId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.feedPostId);
            if (message.feedPostMediaIndex != null && Object.hasOwnProperty.call(message, "feedPostMediaIndex"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.feedPostMediaIndex);
            if (message.chatReplyMessageId != null && Object.hasOwnProperty.call(message, "chatReplyMessageId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.chatReplyMessageId);
            if (message.chatReplyMessageMediaIndex != null && Object.hasOwnProperty.call(message, "chatReplyMessageMediaIndex"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.chatReplyMessageMediaIndex);
            if (message.chatReplyMessageSenderId != null && Object.hasOwnProperty.call(message, "chatReplyMessageSenderId"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.chatReplyMessageSenderId);
            return writer;
        };

        /**
         * Encodes the specified ChatContext message, length delimited. Does not implicitly {@link clients.ChatContext.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.ChatContext
         * @static
         * @param {clients.IChatContext} message ChatContext message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ChatContext.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ChatContext message from the specified reader or buffer.
         * @function decode
         * @memberof clients.ChatContext
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.ChatContext} ChatContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatContext.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.ChatContext();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.feedPostId = reader.string();
                    break;
                case 2:
                    message.feedPostMediaIndex = reader.int32();
                    break;
                case 3:
                    message.chatReplyMessageId = reader.string();
                    break;
                case 4:
                    message.chatReplyMessageMediaIndex = reader.int32();
                    break;
                case 5:
                    message.chatReplyMessageSenderId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ChatContext message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.ChatContext
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.ChatContext} ChatContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ChatContext.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ChatContext message.
         * @function verify
         * @memberof clients.ChatContext
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ChatContext.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.feedPostId != null && message.hasOwnProperty("feedPostId"))
                if (!$util.isString(message.feedPostId))
                    return "feedPostId: string expected";
            if (message.feedPostMediaIndex != null && message.hasOwnProperty("feedPostMediaIndex"))
                if (!$util.isInteger(message.feedPostMediaIndex))
                    return "feedPostMediaIndex: integer expected";
            if (message.chatReplyMessageId != null && message.hasOwnProperty("chatReplyMessageId"))
                if (!$util.isString(message.chatReplyMessageId))
                    return "chatReplyMessageId: string expected";
            if (message.chatReplyMessageMediaIndex != null && message.hasOwnProperty("chatReplyMessageMediaIndex"))
                if (!$util.isInteger(message.chatReplyMessageMediaIndex))
                    return "chatReplyMessageMediaIndex: integer expected";
            if (message.chatReplyMessageSenderId != null && message.hasOwnProperty("chatReplyMessageSenderId"))
                if (!$util.isString(message.chatReplyMessageSenderId))
                    return "chatReplyMessageSenderId: string expected";
            return null;
        };

        /**
         * Creates a ChatContext message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.ChatContext
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.ChatContext} ChatContext
         */
        ChatContext.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.ChatContext)
                return object;
            let message = new $root.clients.ChatContext();
            if (object.feedPostId != null)
                message.feedPostId = String(object.feedPostId);
            if (object.feedPostMediaIndex != null)
                message.feedPostMediaIndex = object.feedPostMediaIndex | 0;
            if (object.chatReplyMessageId != null)
                message.chatReplyMessageId = String(object.chatReplyMessageId);
            if (object.chatReplyMessageMediaIndex != null)
                message.chatReplyMessageMediaIndex = object.chatReplyMessageMediaIndex | 0;
            if (object.chatReplyMessageSenderId != null)
                message.chatReplyMessageSenderId = String(object.chatReplyMessageSenderId);
            return message;
        };

        /**
         * Creates a plain object from a ChatContext message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.ChatContext
         * @static
         * @param {clients.ChatContext} message ChatContext
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ChatContext.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.feedPostId = "";
                object.feedPostMediaIndex = 0;
                object.chatReplyMessageId = "";
                object.chatReplyMessageMediaIndex = 0;
                object.chatReplyMessageSenderId = "";
            }
            if (message.feedPostId != null && message.hasOwnProperty("feedPostId"))
                object.feedPostId = message.feedPostId;
            if (message.feedPostMediaIndex != null && message.hasOwnProperty("feedPostMediaIndex"))
                object.feedPostMediaIndex = message.feedPostMediaIndex;
            if (message.chatReplyMessageId != null && message.hasOwnProperty("chatReplyMessageId"))
                object.chatReplyMessageId = message.chatReplyMessageId;
            if (message.chatReplyMessageMediaIndex != null && message.hasOwnProperty("chatReplyMessageMediaIndex"))
                object.chatReplyMessageMediaIndex = message.chatReplyMessageMediaIndex;
            if (message.chatReplyMessageSenderId != null && message.hasOwnProperty("chatReplyMessageSenderId"))
                object.chatReplyMessageSenderId = message.chatReplyMessageSenderId;
            return object;
        };

        /**
         * Converts this ChatContext to JSON.
         * @function toJSON
         * @memberof clients.ChatContext
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ChatContext.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ChatContext;
    })();

    clients.PostContainer = (function() {

        /**
         * Properties of a PostContainer.
         * @memberof clients
         * @interface IPostContainer
         * @property {clients.IText|null} [text] PostContainer text
         * @property {clients.IAlbum|null} [album] PostContainer album
         * @property {clients.IVoiceNote|null} [voiceNote] PostContainer voiceNote
         */

        /**
         * Constructs a new PostContainer.
         * @memberof clients
         * @classdesc Represents a PostContainer.
         * @implements IPostContainer
         * @constructor
         * @param {clients.IPostContainer=} [properties] Properties to set
         */
        function PostContainer(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PostContainer text.
         * @member {clients.IText|null|undefined} text
         * @memberof clients.PostContainer
         * @instance
         */
        PostContainer.prototype.text = null;

        /**
         * PostContainer album.
         * @member {clients.IAlbum|null|undefined} album
         * @memberof clients.PostContainer
         * @instance
         */
        PostContainer.prototype.album = null;

        /**
         * PostContainer voiceNote.
         * @member {clients.IVoiceNote|null|undefined} voiceNote
         * @memberof clients.PostContainer
         * @instance
         */
        PostContainer.prototype.voiceNote = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * PostContainer post.
         * @member {"text"|"album"|"voiceNote"|undefined} post
         * @memberof clients.PostContainer
         * @instance
         */
        Object.defineProperty(PostContainer.prototype, "post", {
            get: $util.oneOfGetter($oneOfFields = ["text", "album", "voiceNote"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new PostContainer instance using the specified properties.
         * @function create
         * @memberof clients.PostContainer
         * @static
         * @param {clients.IPostContainer=} [properties] Properties to set
         * @returns {clients.PostContainer} PostContainer instance
         */
        PostContainer.create = function create(properties) {
            return new PostContainer(properties);
        };

        /**
         * Encodes the specified PostContainer message. Does not implicitly {@link clients.PostContainer.verify|verify} messages.
         * @function encode
         * @memberof clients.PostContainer
         * @static
         * @param {clients.IPostContainer} message PostContainer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PostContainer.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                $root.clients.Text.encode(message.text, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.album != null && Object.hasOwnProperty.call(message, "album"))
                $root.clients.Album.encode(message.album, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.voiceNote != null && Object.hasOwnProperty.call(message, "voiceNote"))
                $root.clients.VoiceNote.encode(message.voiceNote, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified PostContainer message, length delimited. Does not implicitly {@link clients.PostContainer.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.PostContainer
         * @static
         * @param {clients.IPostContainer} message PostContainer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PostContainer.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PostContainer message from the specified reader or buffer.
         * @function decode
         * @memberof clients.PostContainer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.PostContainer} PostContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PostContainer.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.PostContainer();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.text = $root.clients.Text.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.album = $root.clients.Album.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.voiceNote = $root.clients.VoiceNote.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PostContainer message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.PostContainer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.PostContainer} PostContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PostContainer.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PostContainer message.
         * @function verify
         * @memberof clients.PostContainer
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PostContainer.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.text != null && message.hasOwnProperty("text")) {
                properties.post = 1;
                {
                    let error = $root.clients.Text.verify(message.text);
                    if (error)
                        return "text." + error;
                }
            }
            if (message.album != null && message.hasOwnProperty("album")) {
                if (properties.post === 1)
                    return "post: multiple values";
                properties.post = 1;
                {
                    let error = $root.clients.Album.verify(message.album);
                    if (error)
                        return "album." + error;
                }
            }
            if (message.voiceNote != null && message.hasOwnProperty("voiceNote")) {
                if (properties.post === 1)
                    return "post: multiple values";
                properties.post = 1;
                {
                    let error = $root.clients.VoiceNote.verify(message.voiceNote);
                    if (error)
                        return "voiceNote." + error;
                }
            }
            return null;
        };

        /**
         * Creates a PostContainer message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.PostContainer
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.PostContainer} PostContainer
         */
        PostContainer.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.PostContainer)
                return object;
            let message = new $root.clients.PostContainer();
            if (object.text != null) {
                if (typeof object.text !== "object")
                    throw TypeError(".clients.PostContainer.text: object expected");
                message.text = $root.clients.Text.fromObject(object.text);
            }
            if (object.album != null) {
                if (typeof object.album !== "object")
                    throw TypeError(".clients.PostContainer.album: object expected");
                message.album = $root.clients.Album.fromObject(object.album);
            }
            if (object.voiceNote != null) {
                if (typeof object.voiceNote !== "object")
                    throw TypeError(".clients.PostContainer.voiceNote: object expected");
                message.voiceNote = $root.clients.VoiceNote.fromObject(object.voiceNote);
            }
            return message;
        };

        /**
         * Creates a plain object from a PostContainer message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.PostContainer
         * @static
         * @param {clients.PostContainer} message PostContainer
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PostContainer.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.text != null && message.hasOwnProperty("text")) {
                object.text = $root.clients.Text.toObject(message.text, options);
                if (options.oneofs)
                    object.post = "text";
            }
            if (message.album != null && message.hasOwnProperty("album")) {
                object.album = $root.clients.Album.toObject(message.album, options);
                if (options.oneofs)
                    object.post = "album";
            }
            if (message.voiceNote != null && message.hasOwnProperty("voiceNote")) {
                object.voiceNote = $root.clients.VoiceNote.toObject(message.voiceNote, options);
                if (options.oneofs)
                    object.post = "voiceNote";
            }
            return object;
        };

        /**
         * Converts this PostContainer to JSON.
         * @function toJSON
         * @memberof clients.PostContainer
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PostContainer.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PostContainer;
    })();

    clients.CommentContainer = (function() {

        /**
         * Properties of a CommentContainer.
         * @memberof clients
         * @interface ICommentContainer
         * @property {clients.ICommentContext|null} [context] CommentContainer context
         * @property {clients.IText|null} [text] CommentContainer text
         * @property {clients.IAlbum|null} [album] CommentContainer album
         * @property {clients.IVoiceNote|null} [voiceNote] CommentContainer voiceNote
         */

        /**
         * Constructs a new CommentContainer.
         * @memberof clients
         * @classdesc Represents a CommentContainer.
         * @implements ICommentContainer
         * @constructor
         * @param {clients.ICommentContainer=} [properties] Properties to set
         */
        function CommentContainer(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CommentContainer context.
         * @member {clients.ICommentContext|null|undefined} context
         * @memberof clients.CommentContainer
         * @instance
         */
        CommentContainer.prototype.context = null;

        /**
         * CommentContainer text.
         * @member {clients.IText|null|undefined} text
         * @memberof clients.CommentContainer
         * @instance
         */
        CommentContainer.prototype.text = null;

        /**
         * CommentContainer album.
         * @member {clients.IAlbum|null|undefined} album
         * @memberof clients.CommentContainer
         * @instance
         */
        CommentContainer.prototype.album = null;

        /**
         * CommentContainer voiceNote.
         * @member {clients.IVoiceNote|null|undefined} voiceNote
         * @memberof clients.CommentContainer
         * @instance
         */
        CommentContainer.prototype.voiceNote = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * CommentContainer comment.
         * @member {"text"|"album"|"voiceNote"|undefined} comment
         * @memberof clients.CommentContainer
         * @instance
         */
        Object.defineProperty(CommentContainer.prototype, "comment", {
            get: $util.oneOfGetter($oneOfFields = ["text", "album", "voiceNote"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new CommentContainer instance using the specified properties.
         * @function create
         * @memberof clients.CommentContainer
         * @static
         * @param {clients.ICommentContainer=} [properties] Properties to set
         * @returns {clients.CommentContainer} CommentContainer instance
         */
        CommentContainer.create = function create(properties) {
            return new CommentContainer(properties);
        };

        /**
         * Encodes the specified CommentContainer message. Does not implicitly {@link clients.CommentContainer.verify|verify} messages.
         * @function encode
         * @memberof clients.CommentContainer
         * @static
         * @param {clients.ICommentContainer} message CommentContainer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommentContainer.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.context != null && Object.hasOwnProperty.call(message, "context"))
                $root.clients.CommentContext.encode(message.context, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                $root.clients.Text.encode(message.text, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.album != null && Object.hasOwnProperty.call(message, "album"))
                $root.clients.Album.encode(message.album, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.voiceNote != null && Object.hasOwnProperty.call(message, "voiceNote"))
                $root.clients.VoiceNote.encode(message.voiceNote, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified CommentContainer message, length delimited. Does not implicitly {@link clients.CommentContainer.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.CommentContainer
         * @static
         * @param {clients.ICommentContainer} message CommentContainer message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommentContainer.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CommentContainer message from the specified reader or buffer.
         * @function decode
         * @memberof clients.CommentContainer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.CommentContainer} CommentContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommentContainer.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.CommentContainer();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.context = $root.clients.CommentContext.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.text = $root.clients.Text.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.album = $root.clients.Album.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.voiceNote = $root.clients.VoiceNote.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CommentContainer message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.CommentContainer
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.CommentContainer} CommentContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommentContainer.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CommentContainer message.
         * @function verify
         * @memberof clients.CommentContainer
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CommentContainer.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.context != null && message.hasOwnProperty("context")) {
                let error = $root.clients.CommentContext.verify(message.context);
                if (error)
                    return "context." + error;
            }
            if (message.text != null && message.hasOwnProperty("text")) {
                properties.comment = 1;
                {
                    let error = $root.clients.Text.verify(message.text);
                    if (error)
                        return "text." + error;
                }
            }
            if (message.album != null && message.hasOwnProperty("album")) {
                if (properties.comment === 1)
                    return "comment: multiple values";
                properties.comment = 1;
                {
                    let error = $root.clients.Album.verify(message.album);
                    if (error)
                        return "album." + error;
                }
            }
            if (message.voiceNote != null && message.hasOwnProperty("voiceNote")) {
                if (properties.comment === 1)
                    return "comment: multiple values";
                properties.comment = 1;
                {
                    let error = $root.clients.VoiceNote.verify(message.voiceNote);
                    if (error)
                        return "voiceNote." + error;
                }
            }
            return null;
        };

        /**
         * Creates a CommentContainer message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.CommentContainer
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.CommentContainer} CommentContainer
         */
        CommentContainer.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.CommentContainer)
                return object;
            let message = new $root.clients.CommentContainer();
            if (object.context != null) {
                if (typeof object.context !== "object")
                    throw TypeError(".clients.CommentContainer.context: object expected");
                message.context = $root.clients.CommentContext.fromObject(object.context);
            }
            if (object.text != null) {
                if (typeof object.text !== "object")
                    throw TypeError(".clients.CommentContainer.text: object expected");
                message.text = $root.clients.Text.fromObject(object.text);
            }
            if (object.album != null) {
                if (typeof object.album !== "object")
                    throw TypeError(".clients.CommentContainer.album: object expected");
                message.album = $root.clients.Album.fromObject(object.album);
            }
            if (object.voiceNote != null) {
                if (typeof object.voiceNote !== "object")
                    throw TypeError(".clients.CommentContainer.voiceNote: object expected");
                message.voiceNote = $root.clients.VoiceNote.fromObject(object.voiceNote);
            }
            return message;
        };

        /**
         * Creates a plain object from a CommentContainer message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.CommentContainer
         * @static
         * @param {clients.CommentContainer} message CommentContainer
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CommentContainer.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.context = null;
            if (message.context != null && message.hasOwnProperty("context"))
                object.context = $root.clients.CommentContext.toObject(message.context, options);
            if (message.text != null && message.hasOwnProperty("text")) {
                object.text = $root.clients.Text.toObject(message.text, options);
                if (options.oneofs)
                    object.comment = "text";
            }
            if (message.album != null && message.hasOwnProperty("album")) {
                object.album = $root.clients.Album.toObject(message.album, options);
                if (options.oneofs)
                    object.comment = "album";
            }
            if (message.voiceNote != null && message.hasOwnProperty("voiceNote")) {
                object.voiceNote = $root.clients.VoiceNote.toObject(message.voiceNote, options);
                if (options.oneofs)
                    object.comment = "voiceNote";
            }
            return object;
        };

        /**
         * Converts this CommentContainer to JSON.
         * @function toJSON
         * @memberof clients.CommentContainer
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CommentContainer.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CommentContainer;
    })();

    clients.CommentContext = (function() {

        /**
         * Properties of a CommentContext.
         * @memberof clients
         * @interface ICommentContext
         * @property {string|null} [feedPostId] CommentContext feedPostId
         * @property {string|null} [parentCommentId] CommentContext parentCommentId
         */

        /**
         * Constructs a new CommentContext.
         * @memberof clients
         * @classdesc Represents a CommentContext.
         * @implements ICommentContext
         * @constructor
         * @param {clients.ICommentContext=} [properties] Properties to set
         */
        function CommentContext(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CommentContext feedPostId.
         * @member {string} feedPostId
         * @memberof clients.CommentContext
         * @instance
         */
        CommentContext.prototype.feedPostId = "";

        /**
         * CommentContext parentCommentId.
         * @member {string} parentCommentId
         * @memberof clients.CommentContext
         * @instance
         */
        CommentContext.prototype.parentCommentId = "";

        /**
         * Creates a new CommentContext instance using the specified properties.
         * @function create
         * @memberof clients.CommentContext
         * @static
         * @param {clients.ICommentContext=} [properties] Properties to set
         * @returns {clients.CommentContext} CommentContext instance
         */
        CommentContext.create = function create(properties) {
            return new CommentContext(properties);
        };

        /**
         * Encodes the specified CommentContext message. Does not implicitly {@link clients.CommentContext.verify|verify} messages.
         * @function encode
         * @memberof clients.CommentContext
         * @static
         * @param {clients.ICommentContext} message CommentContext message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommentContext.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.feedPostId != null && Object.hasOwnProperty.call(message, "feedPostId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.feedPostId);
            if (message.parentCommentId != null && Object.hasOwnProperty.call(message, "parentCommentId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.parentCommentId);
            return writer;
        };

        /**
         * Encodes the specified CommentContext message, length delimited. Does not implicitly {@link clients.CommentContext.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.CommentContext
         * @static
         * @param {clients.ICommentContext} message CommentContext message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommentContext.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CommentContext message from the specified reader or buffer.
         * @function decode
         * @memberof clients.CommentContext
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.CommentContext} CommentContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommentContext.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.CommentContext();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.feedPostId = reader.string();
                    break;
                case 2:
                    message.parentCommentId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CommentContext message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.CommentContext
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.CommentContext} CommentContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommentContext.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CommentContext message.
         * @function verify
         * @memberof clients.CommentContext
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CommentContext.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.feedPostId != null && message.hasOwnProperty("feedPostId"))
                if (!$util.isString(message.feedPostId))
                    return "feedPostId: string expected";
            if (message.parentCommentId != null && message.hasOwnProperty("parentCommentId"))
                if (!$util.isString(message.parentCommentId))
                    return "parentCommentId: string expected";
            return null;
        };

        /**
         * Creates a CommentContext message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.CommentContext
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.CommentContext} CommentContext
         */
        CommentContext.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.CommentContext)
                return object;
            let message = new $root.clients.CommentContext();
            if (object.feedPostId != null)
                message.feedPostId = String(object.feedPostId);
            if (object.parentCommentId != null)
                message.parentCommentId = String(object.parentCommentId);
            return message;
        };

        /**
         * Creates a plain object from a CommentContext message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.CommentContext
         * @static
         * @param {clients.CommentContext} message CommentContext
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CommentContext.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.feedPostId = "";
                object.parentCommentId = "";
            }
            if (message.feedPostId != null && message.hasOwnProperty("feedPostId"))
                object.feedPostId = message.feedPostId;
            if (message.parentCommentId != null && message.hasOwnProperty("parentCommentId"))
                object.parentCommentId = message.parentCommentId;
            return object;
        };

        /**
         * Converts this CommentContext to JSON.
         * @function toJSON
         * @memberof clients.CommentContext
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CommentContext.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CommentContext;
    })();

    clients.Container = (function() {

        /**
         * Properties of a Container.
         * @memberof clients
         * @interface IContainer
         * @property {clients.IPostContainer|null} [postContainer] Container postContainer
         * @property {clients.ICommentContainer|null} [commentContainer] Container commentContainer
         * @property {clients.IChatContainer|null} [chatContainer] Container chatContainer
         */

        /**
         * Constructs a new Container.
         * @memberof clients
         * @classdesc Represents a Container.
         * @implements IContainer
         * @constructor
         * @param {clients.IContainer=} [properties] Properties to set
         */
        function Container(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Container postContainer.
         * @member {clients.IPostContainer|null|undefined} postContainer
         * @memberof clients.Container
         * @instance
         */
        Container.prototype.postContainer = null;

        /**
         * Container commentContainer.
         * @member {clients.ICommentContainer|null|undefined} commentContainer
         * @memberof clients.Container
         * @instance
         */
        Container.prototype.commentContainer = null;

        /**
         * Container chatContainer.
         * @member {clients.IChatContainer|null|undefined} chatContainer
         * @memberof clients.Container
         * @instance
         */
        Container.prototype.chatContainer = null;

        /**
         * Creates a new Container instance using the specified properties.
         * @function create
         * @memberof clients.Container
         * @static
         * @param {clients.IContainer=} [properties] Properties to set
         * @returns {clients.Container} Container instance
         */
        Container.create = function create(properties) {
            return new Container(properties);
        };

        /**
         * Encodes the specified Container message. Does not implicitly {@link clients.Container.verify|verify} messages.
         * @function encode
         * @memberof clients.Container
         * @static
         * @param {clients.IContainer} message Container message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Container.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.postContainer != null && Object.hasOwnProperty.call(message, "postContainer"))
                $root.clients.PostContainer.encode(message.postContainer, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.commentContainer != null && Object.hasOwnProperty.call(message, "commentContainer"))
                $root.clients.CommentContainer.encode(message.commentContainer, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.chatContainer != null && Object.hasOwnProperty.call(message, "chatContainer"))
                $root.clients.ChatContainer.encode(message.chatContainer, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Container message, length delimited. Does not implicitly {@link clients.Container.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.Container
         * @static
         * @param {clients.IContainer} message Container message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Container.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Container message from the specified reader or buffer.
         * @function decode
         * @memberof clients.Container
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.Container} Container
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Container.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.Container();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 4:
                    message.postContainer = $root.clients.PostContainer.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.commentContainer = $root.clients.CommentContainer.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.chatContainer = $root.clients.ChatContainer.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Container message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.Container
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.Container} Container
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Container.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Container message.
         * @function verify
         * @memberof clients.Container
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Container.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.postContainer != null && message.hasOwnProperty("postContainer")) {
                let error = $root.clients.PostContainer.verify(message.postContainer);
                if (error)
                    return "postContainer." + error;
            }
            if (message.commentContainer != null && message.hasOwnProperty("commentContainer")) {
                let error = $root.clients.CommentContainer.verify(message.commentContainer);
                if (error)
                    return "commentContainer." + error;
            }
            if (message.chatContainer != null && message.hasOwnProperty("chatContainer")) {
                let error = $root.clients.ChatContainer.verify(message.chatContainer);
                if (error)
                    return "chatContainer." + error;
            }
            return null;
        };

        /**
         * Creates a Container message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.Container
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.Container} Container
         */
        Container.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.Container)
                return object;
            let message = new $root.clients.Container();
            if (object.postContainer != null) {
                if (typeof object.postContainer !== "object")
                    throw TypeError(".clients.Container.postContainer: object expected");
                message.postContainer = $root.clients.PostContainer.fromObject(object.postContainer);
            }
            if (object.commentContainer != null) {
                if (typeof object.commentContainer !== "object")
                    throw TypeError(".clients.Container.commentContainer: object expected");
                message.commentContainer = $root.clients.CommentContainer.fromObject(object.commentContainer);
            }
            if (object.chatContainer != null) {
                if (typeof object.chatContainer !== "object")
                    throw TypeError(".clients.Container.chatContainer: object expected");
                message.chatContainer = $root.clients.ChatContainer.fromObject(object.chatContainer);
            }
            return message;
        };

        /**
         * Creates a plain object from a Container message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.Container
         * @static
         * @param {clients.Container} message Container
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Container.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.postContainer = null;
                object.commentContainer = null;
                object.chatContainer = null;
            }
            if (message.postContainer != null && message.hasOwnProperty("postContainer"))
                object.postContainer = $root.clients.PostContainer.toObject(message.postContainer, options);
            if (message.commentContainer != null && message.hasOwnProperty("commentContainer"))
                object.commentContainer = $root.clients.CommentContainer.toObject(message.commentContainer, options);
            if (message.chatContainer != null && message.hasOwnProperty("chatContainer"))
                object.chatContainer = $root.clients.ChatContainer.toObject(message.chatContainer, options);
            return object;
        };

        /**
         * Converts this Container to JSON.
         * @function toJSON
         * @memberof clients.Container
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Container.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Container;
    })();

    clients.Text = (function() {

        /**
         * Properties of a Text.
         * @memberof clients
         * @interface IText
         * @property {string|null} [text] Text text
         * @property {Array.<clients.IMention>|null} [mentions] Text mentions
         * @property {clients.ILink|null} [link] Text link
         */

        /**
         * Constructs a new Text.
         * @memberof clients
         * @classdesc Represents a Text.
         * @implements IText
         * @constructor
         * @param {clients.IText=} [properties] Properties to set
         */
        function Text(properties) {
            this.mentions = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Text text.
         * @member {string} text
         * @memberof clients.Text
         * @instance
         */
        Text.prototype.text = "";

        /**
         * Text mentions.
         * @member {Array.<clients.IMention>} mentions
         * @memberof clients.Text
         * @instance
         */
        Text.prototype.mentions = $util.emptyArray;

        /**
         * Text link.
         * @member {clients.ILink|null|undefined} link
         * @memberof clients.Text
         * @instance
         */
        Text.prototype.link = null;

        /**
         * Creates a new Text instance using the specified properties.
         * @function create
         * @memberof clients.Text
         * @static
         * @param {clients.IText=} [properties] Properties to set
         * @returns {clients.Text} Text instance
         */
        Text.create = function create(properties) {
            return new Text(properties);
        };

        /**
         * Encodes the specified Text message. Does not implicitly {@link clients.Text.verify|verify} messages.
         * @function encode
         * @memberof clients.Text
         * @static
         * @param {clients.IText} message Text message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Text.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.text);
            if (message.mentions != null && message.mentions.length)
                for (let i = 0; i < message.mentions.length; ++i)
                    $root.clients.Mention.encode(message.mentions[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.link != null && Object.hasOwnProperty.call(message, "link"))
                $root.clients.Link.encode(message.link, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Text message, length delimited. Does not implicitly {@link clients.Text.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.Text
         * @static
         * @param {clients.IText} message Text message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Text.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Text message from the specified reader or buffer.
         * @function decode
         * @memberof clients.Text
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.Text} Text
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Text.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.Text();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.text = reader.string();
                    break;
                case 2:
                    if (!(message.mentions && message.mentions.length))
                        message.mentions = [];
                    message.mentions.push($root.clients.Mention.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.link = $root.clients.Link.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Text message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.Text
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.Text} Text
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Text.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Text message.
         * @function verify
         * @memberof clients.Text
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Text.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.text != null && message.hasOwnProperty("text"))
                if (!$util.isString(message.text))
                    return "text: string expected";
            if (message.mentions != null && message.hasOwnProperty("mentions")) {
                if (!Array.isArray(message.mentions))
                    return "mentions: array expected";
                for (let i = 0; i < message.mentions.length; ++i) {
                    let error = $root.clients.Mention.verify(message.mentions[i]);
                    if (error)
                        return "mentions." + error;
                }
            }
            if (message.link != null && message.hasOwnProperty("link")) {
                let error = $root.clients.Link.verify(message.link);
                if (error)
                    return "link." + error;
            }
            return null;
        };

        /**
         * Creates a Text message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.Text
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.Text} Text
         */
        Text.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.Text)
                return object;
            let message = new $root.clients.Text();
            if (object.text != null)
                message.text = String(object.text);
            if (object.mentions) {
                if (!Array.isArray(object.mentions))
                    throw TypeError(".clients.Text.mentions: array expected");
                message.mentions = [];
                for (let i = 0; i < object.mentions.length; ++i) {
                    if (typeof object.mentions[i] !== "object")
                        throw TypeError(".clients.Text.mentions: object expected");
                    message.mentions[i] = $root.clients.Mention.fromObject(object.mentions[i]);
                }
            }
            if (object.link != null) {
                if (typeof object.link !== "object")
                    throw TypeError(".clients.Text.link: object expected");
                message.link = $root.clients.Link.fromObject(object.link);
            }
            return message;
        };

        /**
         * Creates a plain object from a Text message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.Text
         * @static
         * @param {clients.Text} message Text
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Text.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.mentions = [];
            if (options.defaults) {
                object.text = "";
                object.link = null;
            }
            if (message.text != null && message.hasOwnProperty("text"))
                object.text = message.text;
            if (message.mentions && message.mentions.length) {
                object.mentions = [];
                for (let j = 0; j < message.mentions.length; ++j)
                    object.mentions[j] = $root.clients.Mention.toObject(message.mentions[j], options);
            }
            if (message.link != null && message.hasOwnProperty("link"))
                object.link = $root.clients.Link.toObject(message.link, options);
            return object;
        };

        /**
         * Converts this Text to JSON.
         * @function toJSON
         * @memberof clients.Text
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Text.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Text;
    })();

    clients.ContactCard = (function() {

        /**
         * Properties of a ContactCard.
         * @memberof clients
         * @interface IContactCard
         * @property {Array.<clients.IContact>|null} [contacts] ContactCard contacts
         * @property {clients.IText|null} [text] ContactCard text
         */

        /**
         * Constructs a new ContactCard.
         * @memberof clients
         * @classdesc Represents a ContactCard.
         * @implements IContactCard
         * @constructor
         * @param {clients.IContactCard=} [properties] Properties to set
         */
        function ContactCard(properties) {
            this.contacts = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ContactCard contacts.
         * @member {Array.<clients.IContact>} contacts
         * @memberof clients.ContactCard
         * @instance
         */
        ContactCard.prototype.contacts = $util.emptyArray;

        /**
         * ContactCard text.
         * @member {clients.IText|null|undefined} text
         * @memberof clients.ContactCard
         * @instance
         */
        ContactCard.prototype.text = null;

        /**
         * Creates a new ContactCard instance using the specified properties.
         * @function create
         * @memberof clients.ContactCard
         * @static
         * @param {clients.IContactCard=} [properties] Properties to set
         * @returns {clients.ContactCard} ContactCard instance
         */
        ContactCard.create = function create(properties) {
            return new ContactCard(properties);
        };

        /**
         * Encodes the specified ContactCard message. Does not implicitly {@link clients.ContactCard.verify|verify} messages.
         * @function encode
         * @memberof clients.ContactCard
         * @static
         * @param {clients.IContactCard} message ContactCard message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContactCard.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.contacts != null && message.contacts.length)
                for (let i = 0; i < message.contacts.length; ++i)
                    $root.clients.Contact.encode(message.contacts[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                $root.clients.Text.encode(message.text, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ContactCard message, length delimited. Does not implicitly {@link clients.ContactCard.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.ContactCard
         * @static
         * @param {clients.IContactCard} message ContactCard message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContactCard.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ContactCard message from the specified reader or buffer.
         * @function decode
         * @memberof clients.ContactCard
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.ContactCard} ContactCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContactCard.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.ContactCard();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.contacts && message.contacts.length))
                        message.contacts = [];
                    message.contacts.push($root.clients.Contact.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.text = $root.clients.Text.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ContactCard message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.ContactCard
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.ContactCard} ContactCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContactCard.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ContactCard message.
         * @function verify
         * @memberof clients.ContactCard
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ContactCard.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.contacts != null && message.hasOwnProperty("contacts")) {
                if (!Array.isArray(message.contacts))
                    return "contacts: array expected";
                for (let i = 0; i < message.contacts.length; ++i) {
                    let error = $root.clients.Contact.verify(message.contacts[i]);
                    if (error)
                        return "contacts." + error;
                }
            }
            if (message.text != null && message.hasOwnProperty("text")) {
                let error = $root.clients.Text.verify(message.text);
                if (error)
                    return "text." + error;
            }
            return null;
        };

        /**
         * Creates a ContactCard message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.ContactCard
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.ContactCard} ContactCard
         */
        ContactCard.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.ContactCard)
                return object;
            let message = new $root.clients.ContactCard();
            if (object.contacts) {
                if (!Array.isArray(object.contacts))
                    throw TypeError(".clients.ContactCard.contacts: array expected");
                message.contacts = [];
                for (let i = 0; i < object.contacts.length; ++i) {
                    if (typeof object.contacts[i] !== "object")
                        throw TypeError(".clients.ContactCard.contacts: object expected");
                    message.contacts[i] = $root.clients.Contact.fromObject(object.contacts[i]);
                }
            }
            if (object.text != null) {
                if (typeof object.text !== "object")
                    throw TypeError(".clients.ContactCard.text: object expected");
                message.text = $root.clients.Text.fromObject(object.text);
            }
            return message;
        };

        /**
         * Creates a plain object from a ContactCard message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.ContactCard
         * @static
         * @param {clients.ContactCard} message ContactCard
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ContactCard.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.contacts = [];
            if (options.defaults)
                object.text = null;
            if (message.contacts && message.contacts.length) {
                object.contacts = [];
                for (let j = 0; j < message.contacts.length; ++j)
                    object.contacts[j] = $root.clients.Contact.toObject(message.contacts[j], options);
            }
            if (message.text != null && message.hasOwnProperty("text"))
                object.text = $root.clients.Text.toObject(message.text, options);
            return object;
        };

        /**
         * Converts this ContactCard to JSON.
         * @function toJSON
         * @memberof clients.ContactCard
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ContactCard.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ContactCard;
    })();

    clients.Image = (function() {

        /**
         * Properties of an Image.
         * @memberof clients
         * @interface IImage
         * @property {clients.IEncryptedResource|null} [img] Image img
         * @property {number|null} [width] Image width
         * @property {number|null} [height] Image height
         */

        /**
         * Constructs a new Image.
         * @memberof clients
         * @classdesc Represents an Image.
         * @implements IImage
         * @constructor
         * @param {clients.IImage=} [properties] Properties to set
         */
        function Image(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Image img.
         * @member {clients.IEncryptedResource|null|undefined} img
         * @memberof clients.Image
         * @instance
         */
        Image.prototype.img = null;

        /**
         * Image width.
         * @member {number} width
         * @memberof clients.Image
         * @instance
         */
        Image.prototype.width = 0;

        /**
         * Image height.
         * @member {number} height
         * @memberof clients.Image
         * @instance
         */
        Image.prototype.height = 0;

        /**
         * Creates a new Image instance using the specified properties.
         * @function create
         * @memberof clients.Image
         * @static
         * @param {clients.IImage=} [properties] Properties to set
         * @returns {clients.Image} Image instance
         */
        Image.create = function create(properties) {
            return new Image(properties);
        };

        /**
         * Encodes the specified Image message. Does not implicitly {@link clients.Image.verify|verify} messages.
         * @function encode
         * @memberof clients.Image
         * @static
         * @param {clients.IImage} message Image message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Image.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.img != null && Object.hasOwnProperty.call(message, "img"))
                $root.clients.EncryptedResource.encode(message.img, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.width);
            if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.height);
            return writer;
        };

        /**
         * Encodes the specified Image message, length delimited. Does not implicitly {@link clients.Image.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.Image
         * @static
         * @param {clients.IImage} message Image message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Image.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Image message from the specified reader or buffer.
         * @function decode
         * @memberof clients.Image
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.Image} Image
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Image.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.Image();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.img = $root.clients.EncryptedResource.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.width = reader.int32();
                    break;
                case 3:
                    message.height = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Image message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.Image
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.Image} Image
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Image.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Image message.
         * @function verify
         * @memberof clients.Image
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Image.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.img != null && message.hasOwnProperty("img")) {
                let error = $root.clients.EncryptedResource.verify(message.img);
                if (error)
                    return "img." + error;
            }
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            return null;
        };

        /**
         * Creates an Image message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.Image
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.Image} Image
         */
        Image.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.Image)
                return object;
            let message = new $root.clients.Image();
            if (object.img != null) {
                if (typeof object.img !== "object")
                    throw TypeError(".clients.Image.img: object expected");
                message.img = $root.clients.EncryptedResource.fromObject(object.img);
            }
            if (object.width != null)
                message.width = object.width | 0;
            if (object.height != null)
                message.height = object.height | 0;
            return message;
        };

        /**
         * Creates a plain object from an Image message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.Image
         * @static
         * @param {clients.Image} message Image
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Image.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.img = null;
                object.width = 0;
                object.height = 0;
            }
            if (message.img != null && message.hasOwnProperty("img"))
                object.img = $root.clients.EncryptedResource.toObject(message.img, options);
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            return object;
        };

        /**
         * Converts this Image to JSON.
         * @function toJSON
         * @memberof clients.Image
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Image.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Image;
    })();

    clients.StreamingInfo = (function() {

        /**
         * Properties of a StreamingInfo.
         * @memberof clients
         * @interface IStreamingInfo
         * @property {clients.BlobVersion|null} [blobVersion] StreamingInfo blobVersion
         * @property {number|null} [chunkSize] StreamingInfo chunkSize
         * @property {number|Long|null} [blobSize] StreamingInfo blobSize
         */

        /**
         * Constructs a new StreamingInfo.
         * @memberof clients
         * @classdesc Represents a StreamingInfo.
         * @implements IStreamingInfo
         * @constructor
         * @param {clients.IStreamingInfo=} [properties] Properties to set
         */
        function StreamingInfo(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StreamingInfo blobVersion.
         * @member {clients.BlobVersion} blobVersion
         * @memberof clients.StreamingInfo
         * @instance
         */
        StreamingInfo.prototype.blobVersion = 0;

        /**
         * StreamingInfo chunkSize.
         * @member {number} chunkSize
         * @memberof clients.StreamingInfo
         * @instance
         */
        StreamingInfo.prototype.chunkSize = 0;

        /**
         * StreamingInfo blobSize.
         * @member {number|Long} blobSize
         * @memberof clients.StreamingInfo
         * @instance
         */
        StreamingInfo.prototype.blobSize = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Creates a new StreamingInfo instance using the specified properties.
         * @function create
         * @memberof clients.StreamingInfo
         * @static
         * @param {clients.IStreamingInfo=} [properties] Properties to set
         * @returns {clients.StreamingInfo} StreamingInfo instance
         */
        StreamingInfo.create = function create(properties) {
            return new StreamingInfo(properties);
        };

        /**
         * Encodes the specified StreamingInfo message. Does not implicitly {@link clients.StreamingInfo.verify|verify} messages.
         * @function encode
         * @memberof clients.StreamingInfo
         * @static
         * @param {clients.IStreamingInfo} message StreamingInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StreamingInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.blobVersion != null && Object.hasOwnProperty.call(message, "blobVersion"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.blobVersion);
            if (message.chunkSize != null && Object.hasOwnProperty.call(message, "chunkSize"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.chunkSize);
            if (message.blobSize != null && Object.hasOwnProperty.call(message, "blobSize"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.blobSize);
            return writer;
        };

        /**
         * Encodes the specified StreamingInfo message, length delimited. Does not implicitly {@link clients.StreamingInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.StreamingInfo
         * @static
         * @param {clients.IStreamingInfo} message StreamingInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StreamingInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StreamingInfo message from the specified reader or buffer.
         * @function decode
         * @memberof clients.StreamingInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.StreamingInfo} StreamingInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StreamingInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.StreamingInfo();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.blobVersion = reader.int32();
                    break;
                case 2:
                    message.chunkSize = reader.int32();
                    break;
                case 3:
                    message.blobSize = reader.int64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StreamingInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.StreamingInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.StreamingInfo} StreamingInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StreamingInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StreamingInfo message.
         * @function verify
         * @memberof clients.StreamingInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StreamingInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.blobVersion != null && message.hasOwnProperty("blobVersion"))
                switch (message.blobVersion) {
                default:
                    return "blobVersion: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.chunkSize != null && message.hasOwnProperty("chunkSize"))
                if (!$util.isInteger(message.chunkSize))
                    return "chunkSize: integer expected";
            if (message.blobSize != null && message.hasOwnProperty("blobSize"))
                if (!$util.isInteger(message.blobSize) && !(message.blobSize && $util.isInteger(message.blobSize.low) && $util.isInteger(message.blobSize.high)))
                    return "blobSize: integer|Long expected";
            return null;
        };

        /**
         * Creates a StreamingInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.StreamingInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.StreamingInfo} StreamingInfo
         */
        StreamingInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.StreamingInfo)
                return object;
            let message = new $root.clients.StreamingInfo();
            switch (object.blobVersion) {
            case "BLOB_VERSION_DEFAULT":
            case 0:
                message.blobVersion = 0;
                break;
            case "BLOB_VERSION_CHUNKED":
            case 1:
                message.blobVersion = 1;
                break;
            }
            if (object.chunkSize != null)
                message.chunkSize = object.chunkSize | 0;
            if (object.blobSize != null)
                if ($util.Long)
                    (message.blobSize = $util.Long.fromValue(object.blobSize)).unsigned = false;
                else if (typeof object.blobSize === "string")
                    message.blobSize = parseInt(object.blobSize, 10);
                else if (typeof object.blobSize === "number")
                    message.blobSize = object.blobSize;
                else if (typeof object.blobSize === "object")
                    message.blobSize = new $util.LongBits(object.blobSize.low >>> 0, object.blobSize.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a StreamingInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.StreamingInfo
         * @static
         * @param {clients.StreamingInfo} message StreamingInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StreamingInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.blobVersion = options.enums === String ? "BLOB_VERSION_DEFAULT" : 0;
                object.chunkSize = 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.blobSize = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.blobSize = options.longs === String ? "0" : 0;
            }
            if (message.blobVersion != null && message.hasOwnProperty("blobVersion"))
                object.blobVersion = options.enums === String ? $root.clients.BlobVersion[message.blobVersion] : message.blobVersion;
            if (message.chunkSize != null && message.hasOwnProperty("chunkSize"))
                object.chunkSize = message.chunkSize;
            if (message.blobSize != null && message.hasOwnProperty("blobSize"))
                if (typeof message.blobSize === "number")
                    object.blobSize = options.longs === String ? String(message.blobSize) : message.blobSize;
                else
                    object.blobSize = options.longs === String ? $util.Long.prototype.toString.call(message.blobSize) : options.longs === Number ? new $util.LongBits(message.blobSize.low >>> 0, message.blobSize.high >>> 0).toNumber() : message.blobSize;
            return object;
        };

        /**
         * Converts this StreamingInfo to JSON.
         * @function toJSON
         * @memberof clients.StreamingInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StreamingInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return StreamingInfo;
    })();

    clients.Video = (function() {

        /**
         * Properties of a Video.
         * @memberof clients
         * @interface IVideo
         * @property {clients.IEncryptedResource|null} [video] Video video
         * @property {number|null} [width] Video width
         * @property {number|null} [height] Video height
         * @property {clients.IStreamingInfo|null} [streamingInfo] Video streamingInfo
         */

        /**
         * Constructs a new Video.
         * @memberof clients
         * @classdesc Represents a Video.
         * @implements IVideo
         * @constructor
         * @param {clients.IVideo=} [properties] Properties to set
         */
        function Video(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Video video.
         * @member {clients.IEncryptedResource|null|undefined} video
         * @memberof clients.Video
         * @instance
         */
        Video.prototype.video = null;

        /**
         * Video width.
         * @member {number} width
         * @memberof clients.Video
         * @instance
         */
        Video.prototype.width = 0;

        /**
         * Video height.
         * @member {number} height
         * @memberof clients.Video
         * @instance
         */
        Video.prototype.height = 0;

        /**
         * Video streamingInfo.
         * @member {clients.IStreamingInfo|null|undefined} streamingInfo
         * @memberof clients.Video
         * @instance
         */
        Video.prototype.streamingInfo = null;

        /**
         * Creates a new Video instance using the specified properties.
         * @function create
         * @memberof clients.Video
         * @static
         * @param {clients.IVideo=} [properties] Properties to set
         * @returns {clients.Video} Video instance
         */
        Video.create = function create(properties) {
            return new Video(properties);
        };

        /**
         * Encodes the specified Video message. Does not implicitly {@link clients.Video.verify|verify} messages.
         * @function encode
         * @memberof clients.Video
         * @static
         * @param {clients.IVideo} message Video message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Video.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.video != null && Object.hasOwnProperty.call(message, "video"))
                $root.clients.EncryptedResource.encode(message.video, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.width != null && Object.hasOwnProperty.call(message, "width"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.width);
            if (message.height != null && Object.hasOwnProperty.call(message, "height"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.height);
            if (message.streamingInfo != null && Object.hasOwnProperty.call(message, "streamingInfo"))
                $root.clients.StreamingInfo.encode(message.streamingInfo, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Video message, length delimited. Does not implicitly {@link clients.Video.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.Video
         * @static
         * @param {clients.IVideo} message Video message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Video.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Video message from the specified reader or buffer.
         * @function decode
         * @memberof clients.Video
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.Video} Video
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Video.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.Video();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.video = $root.clients.EncryptedResource.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.width = reader.int32();
                    break;
                case 3:
                    message.height = reader.int32();
                    break;
                case 4:
                    message.streamingInfo = $root.clients.StreamingInfo.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Video message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.Video
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.Video} Video
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Video.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Video message.
         * @function verify
         * @memberof clients.Video
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Video.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.video != null && message.hasOwnProperty("video")) {
                let error = $root.clients.EncryptedResource.verify(message.video);
                if (error)
                    return "video." + error;
            }
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            if (message.streamingInfo != null && message.hasOwnProperty("streamingInfo")) {
                let error = $root.clients.StreamingInfo.verify(message.streamingInfo);
                if (error)
                    return "streamingInfo." + error;
            }
            return null;
        };

        /**
         * Creates a Video message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.Video
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.Video} Video
         */
        Video.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.Video)
                return object;
            let message = new $root.clients.Video();
            if (object.video != null) {
                if (typeof object.video !== "object")
                    throw TypeError(".clients.Video.video: object expected");
                message.video = $root.clients.EncryptedResource.fromObject(object.video);
            }
            if (object.width != null)
                message.width = object.width | 0;
            if (object.height != null)
                message.height = object.height | 0;
            if (object.streamingInfo != null) {
                if (typeof object.streamingInfo !== "object")
                    throw TypeError(".clients.Video.streamingInfo: object expected");
                message.streamingInfo = $root.clients.StreamingInfo.fromObject(object.streamingInfo);
            }
            return message;
        };

        /**
         * Creates a plain object from a Video message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.Video
         * @static
         * @param {clients.Video} message Video
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Video.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.video = null;
                object.width = 0;
                object.height = 0;
                object.streamingInfo = null;
            }
            if (message.video != null && message.hasOwnProperty("video"))
                object.video = $root.clients.EncryptedResource.toObject(message.video, options);
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            if (message.streamingInfo != null && message.hasOwnProperty("streamingInfo"))
                object.streamingInfo = $root.clients.StreamingInfo.toObject(message.streamingInfo, options);
            return object;
        };

        /**
         * Converts this Video to JSON.
         * @function toJSON
         * @memberof clients.Video
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Video.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Video;
    })();

    clients.AlbumMedia = (function() {

        /**
         * Properties of an AlbumMedia.
         * @memberof clients
         * @interface IAlbumMedia
         * @property {clients.IImage|null} [image] AlbumMedia image
         * @property {clients.IVideo|null} [video] AlbumMedia video
         */

        /**
         * Constructs a new AlbumMedia.
         * @memberof clients
         * @classdesc Represents an AlbumMedia.
         * @implements IAlbumMedia
         * @constructor
         * @param {clients.IAlbumMedia=} [properties] Properties to set
         */
        function AlbumMedia(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AlbumMedia image.
         * @member {clients.IImage|null|undefined} image
         * @memberof clients.AlbumMedia
         * @instance
         */
        AlbumMedia.prototype.image = null;

        /**
         * AlbumMedia video.
         * @member {clients.IVideo|null|undefined} video
         * @memberof clients.AlbumMedia
         * @instance
         */
        AlbumMedia.prototype.video = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * AlbumMedia media.
         * @member {"image"|"video"|undefined} media
         * @memberof clients.AlbumMedia
         * @instance
         */
        Object.defineProperty(AlbumMedia.prototype, "media", {
            get: $util.oneOfGetter($oneOfFields = ["image", "video"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new AlbumMedia instance using the specified properties.
         * @function create
         * @memberof clients.AlbumMedia
         * @static
         * @param {clients.IAlbumMedia=} [properties] Properties to set
         * @returns {clients.AlbumMedia} AlbumMedia instance
         */
        AlbumMedia.create = function create(properties) {
            return new AlbumMedia(properties);
        };

        /**
         * Encodes the specified AlbumMedia message. Does not implicitly {@link clients.AlbumMedia.verify|verify} messages.
         * @function encode
         * @memberof clients.AlbumMedia
         * @static
         * @param {clients.IAlbumMedia} message AlbumMedia message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AlbumMedia.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.image != null && Object.hasOwnProperty.call(message, "image"))
                $root.clients.Image.encode(message.image, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.video != null && Object.hasOwnProperty.call(message, "video"))
                $root.clients.Video.encode(message.video, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified AlbumMedia message, length delimited. Does not implicitly {@link clients.AlbumMedia.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.AlbumMedia
         * @static
         * @param {clients.IAlbumMedia} message AlbumMedia message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AlbumMedia.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AlbumMedia message from the specified reader or buffer.
         * @function decode
         * @memberof clients.AlbumMedia
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.AlbumMedia} AlbumMedia
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AlbumMedia.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.AlbumMedia();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.image = $root.clients.Image.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.video = $root.clients.Video.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AlbumMedia message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.AlbumMedia
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.AlbumMedia} AlbumMedia
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AlbumMedia.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AlbumMedia message.
         * @function verify
         * @memberof clients.AlbumMedia
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AlbumMedia.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.image != null && message.hasOwnProperty("image")) {
                properties.media = 1;
                {
                    let error = $root.clients.Image.verify(message.image);
                    if (error)
                        return "image." + error;
                }
            }
            if (message.video != null && message.hasOwnProperty("video")) {
                if (properties.media === 1)
                    return "media: multiple values";
                properties.media = 1;
                {
                    let error = $root.clients.Video.verify(message.video);
                    if (error)
                        return "video." + error;
                }
            }
            return null;
        };

        /**
         * Creates an AlbumMedia message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.AlbumMedia
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.AlbumMedia} AlbumMedia
         */
        AlbumMedia.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.AlbumMedia)
                return object;
            let message = new $root.clients.AlbumMedia();
            if (object.image != null) {
                if (typeof object.image !== "object")
                    throw TypeError(".clients.AlbumMedia.image: object expected");
                message.image = $root.clients.Image.fromObject(object.image);
            }
            if (object.video != null) {
                if (typeof object.video !== "object")
                    throw TypeError(".clients.AlbumMedia.video: object expected");
                message.video = $root.clients.Video.fromObject(object.video);
            }
            return message;
        };

        /**
         * Creates a plain object from an AlbumMedia message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.AlbumMedia
         * @static
         * @param {clients.AlbumMedia} message AlbumMedia
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AlbumMedia.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.image != null && message.hasOwnProperty("image")) {
                object.image = $root.clients.Image.toObject(message.image, options);
                if (options.oneofs)
                    object.media = "image";
            }
            if (message.video != null && message.hasOwnProperty("video")) {
                object.video = $root.clients.Video.toObject(message.video, options);
                if (options.oneofs)
                    object.media = "video";
            }
            return object;
        };

        /**
         * Converts this AlbumMedia to JSON.
         * @function toJSON
         * @memberof clients.AlbumMedia
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AlbumMedia.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AlbumMedia;
    })();

    clients.Album = (function() {

        /**
         * Properties of an Album.
         * @memberof clients
         * @interface IAlbum
         * @property {Array.<clients.IAlbumMedia>|null} [media] Album media
         * @property {clients.IText|null} [text] Album text
         * @property {clients.IVoiceNote|null} [voiceNote] Album voiceNote
         */

        /**
         * Constructs a new Album.
         * @memberof clients
         * @classdesc Represents an Album.
         * @implements IAlbum
         * @constructor
         * @param {clients.IAlbum=} [properties] Properties to set
         */
        function Album(properties) {
            this.media = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Album media.
         * @member {Array.<clients.IAlbumMedia>} media
         * @memberof clients.Album
         * @instance
         */
        Album.prototype.media = $util.emptyArray;

        /**
         * Album text.
         * @member {clients.IText|null|undefined} text
         * @memberof clients.Album
         * @instance
         */
        Album.prototype.text = null;

        /**
         * Album voiceNote.
         * @member {clients.IVoiceNote|null|undefined} voiceNote
         * @memberof clients.Album
         * @instance
         */
        Album.prototype.voiceNote = null;

        /**
         * Creates a new Album instance using the specified properties.
         * @function create
         * @memberof clients.Album
         * @static
         * @param {clients.IAlbum=} [properties] Properties to set
         * @returns {clients.Album} Album instance
         */
        Album.create = function create(properties) {
            return new Album(properties);
        };

        /**
         * Encodes the specified Album message. Does not implicitly {@link clients.Album.verify|verify} messages.
         * @function encode
         * @memberof clients.Album
         * @static
         * @param {clients.IAlbum} message Album message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Album.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.media != null && message.media.length)
                for (let i = 0; i < message.media.length; ++i)
                    $root.clients.AlbumMedia.encode(message.media[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.text != null && Object.hasOwnProperty.call(message, "text"))
                $root.clients.Text.encode(message.text, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.voiceNote != null && Object.hasOwnProperty.call(message, "voiceNote"))
                $root.clients.VoiceNote.encode(message.voiceNote, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Album message, length delimited. Does not implicitly {@link clients.Album.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.Album
         * @static
         * @param {clients.IAlbum} message Album message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Album.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Album message from the specified reader or buffer.
         * @function decode
         * @memberof clients.Album
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.Album} Album
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Album.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.Album();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.media && message.media.length))
                        message.media = [];
                    message.media.push($root.clients.AlbumMedia.decode(reader, reader.uint32()));
                    break;
                case 2:
                    message.text = $root.clients.Text.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.voiceNote = $root.clients.VoiceNote.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Album message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.Album
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.Album} Album
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Album.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Album message.
         * @function verify
         * @memberof clients.Album
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Album.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.media != null && message.hasOwnProperty("media")) {
                if (!Array.isArray(message.media))
                    return "media: array expected";
                for (let i = 0; i < message.media.length; ++i) {
                    let error = $root.clients.AlbumMedia.verify(message.media[i]);
                    if (error)
                        return "media." + error;
                }
            }
            if (message.text != null && message.hasOwnProperty("text")) {
                let error = $root.clients.Text.verify(message.text);
                if (error)
                    return "text." + error;
            }
            if (message.voiceNote != null && message.hasOwnProperty("voiceNote")) {
                let error = $root.clients.VoiceNote.verify(message.voiceNote);
                if (error)
                    return "voiceNote." + error;
            }
            return null;
        };

        /**
         * Creates an Album message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.Album
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.Album} Album
         */
        Album.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.Album)
                return object;
            let message = new $root.clients.Album();
            if (object.media) {
                if (!Array.isArray(object.media))
                    throw TypeError(".clients.Album.media: array expected");
                message.media = [];
                for (let i = 0; i < object.media.length; ++i) {
                    if (typeof object.media[i] !== "object")
                        throw TypeError(".clients.Album.media: object expected");
                    message.media[i] = $root.clients.AlbumMedia.fromObject(object.media[i]);
                }
            }
            if (object.text != null) {
                if (typeof object.text !== "object")
                    throw TypeError(".clients.Album.text: object expected");
                message.text = $root.clients.Text.fromObject(object.text);
            }
            if (object.voiceNote != null) {
                if (typeof object.voiceNote !== "object")
                    throw TypeError(".clients.Album.voiceNote: object expected");
                message.voiceNote = $root.clients.VoiceNote.fromObject(object.voiceNote);
            }
            return message;
        };

        /**
         * Creates a plain object from an Album message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.Album
         * @static
         * @param {clients.Album} message Album
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Album.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.media = [];
            if (options.defaults) {
                object.text = null;
                object.voiceNote = null;
            }
            if (message.media && message.media.length) {
                object.media = [];
                for (let j = 0; j < message.media.length; ++j)
                    object.media[j] = $root.clients.AlbumMedia.toObject(message.media[j], options);
            }
            if (message.text != null && message.hasOwnProperty("text"))
                object.text = $root.clients.Text.toObject(message.text, options);
            if (message.voiceNote != null && message.hasOwnProperty("voiceNote"))
                object.voiceNote = $root.clients.VoiceNote.toObject(message.voiceNote, options);
            return object;
        };

        /**
         * Converts this Album to JSON.
         * @function toJSON
         * @memberof clients.Album
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Album.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Album;
    })();

    clients.SenderKey = (function() {

        /**
         * Properties of a SenderKey.
         * @memberof clients
         * @interface ISenderKey
         * @property {Uint8Array|null} [chainKey] SenderKey chainKey
         * @property {Uint8Array|null} [publicSignatureKey] SenderKey publicSignatureKey
         */

        /**
         * Constructs a new SenderKey.
         * @memberof clients
         * @classdesc Represents a SenderKey.
         * @implements ISenderKey
         * @constructor
         * @param {clients.ISenderKey=} [properties] Properties to set
         */
        function SenderKey(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SenderKey chainKey.
         * @member {Uint8Array} chainKey
         * @memberof clients.SenderKey
         * @instance
         */
        SenderKey.prototype.chainKey = $util.newBuffer([]);

        /**
         * SenderKey publicSignatureKey.
         * @member {Uint8Array} publicSignatureKey
         * @memberof clients.SenderKey
         * @instance
         */
        SenderKey.prototype.publicSignatureKey = $util.newBuffer([]);

        /**
         * Creates a new SenderKey instance using the specified properties.
         * @function create
         * @memberof clients.SenderKey
         * @static
         * @param {clients.ISenderKey=} [properties] Properties to set
         * @returns {clients.SenderKey} SenderKey instance
         */
        SenderKey.create = function create(properties) {
            return new SenderKey(properties);
        };

        /**
         * Encodes the specified SenderKey message. Does not implicitly {@link clients.SenderKey.verify|verify} messages.
         * @function encode
         * @memberof clients.SenderKey
         * @static
         * @param {clients.ISenderKey} message SenderKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderKey.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.chainKey != null && Object.hasOwnProperty.call(message, "chainKey"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.chainKey);
            if (message.publicSignatureKey != null && Object.hasOwnProperty.call(message, "publicSignatureKey"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.publicSignatureKey);
            return writer;
        };

        /**
         * Encodes the specified SenderKey message, length delimited. Does not implicitly {@link clients.SenderKey.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.SenderKey
         * @static
         * @param {clients.ISenderKey} message SenderKey message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderKey.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SenderKey message from the specified reader or buffer.
         * @function decode
         * @memberof clients.SenderKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.SenderKey} SenderKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderKey.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.SenderKey();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.chainKey = reader.bytes();
                    break;
                case 2:
                    message.publicSignatureKey = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SenderKey message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.SenderKey
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.SenderKey} SenderKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderKey.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SenderKey message.
         * @function verify
         * @memberof clients.SenderKey
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SenderKey.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.chainKey != null && message.hasOwnProperty("chainKey"))
                if (!(message.chainKey && typeof message.chainKey.length === "number" || $util.isString(message.chainKey)))
                    return "chainKey: buffer expected";
            if (message.publicSignatureKey != null && message.hasOwnProperty("publicSignatureKey"))
                if (!(message.publicSignatureKey && typeof message.publicSignatureKey.length === "number" || $util.isString(message.publicSignatureKey)))
                    return "publicSignatureKey: buffer expected";
            return null;
        };

        /**
         * Creates a SenderKey message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.SenderKey
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.SenderKey} SenderKey
         */
        SenderKey.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.SenderKey)
                return object;
            let message = new $root.clients.SenderKey();
            if (object.chainKey != null)
                if (typeof object.chainKey === "string")
                    $util.base64.decode(object.chainKey, message.chainKey = $util.newBuffer($util.base64.length(object.chainKey)), 0);
                else if (object.chainKey.length)
                    message.chainKey = object.chainKey;
            if (object.publicSignatureKey != null)
                if (typeof object.publicSignatureKey === "string")
                    $util.base64.decode(object.publicSignatureKey, message.publicSignatureKey = $util.newBuffer($util.base64.length(object.publicSignatureKey)), 0);
                else if (object.publicSignatureKey.length)
                    message.publicSignatureKey = object.publicSignatureKey;
            return message;
        };

        /**
         * Creates a plain object from a SenderKey message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.SenderKey
         * @static
         * @param {clients.SenderKey} message SenderKey
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SenderKey.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                if (options.bytes === String)
                    object.chainKey = "";
                else {
                    object.chainKey = [];
                    if (options.bytes !== Array)
                        object.chainKey = $util.newBuffer(object.chainKey);
                }
                if (options.bytes === String)
                    object.publicSignatureKey = "";
                else {
                    object.publicSignatureKey = [];
                    if (options.bytes !== Array)
                        object.publicSignatureKey = $util.newBuffer(object.publicSignatureKey);
                }
            }
            if (message.chainKey != null && message.hasOwnProperty("chainKey"))
                object.chainKey = options.bytes === String ? $util.base64.encode(message.chainKey, 0, message.chainKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.chainKey) : message.chainKey;
            if (message.publicSignatureKey != null && message.hasOwnProperty("publicSignatureKey"))
                object.publicSignatureKey = options.bytes === String ? $util.base64.encode(message.publicSignatureKey, 0, message.publicSignatureKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.publicSignatureKey) : message.publicSignatureKey;
            return object;
        };

        /**
         * Converts this SenderKey to JSON.
         * @function toJSON
         * @memberof clients.SenderKey
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SenderKey.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SenderKey;
    })();

    clients.SenderState = (function() {

        /**
         * Properties of a SenderState.
         * @memberof clients
         * @interface ISenderState
         * @property {clients.ISenderKey|null} [senderKey] SenderState senderKey
         * @property {number|null} [currentChainIndex] SenderState currentChainIndex
         */

        /**
         * Constructs a new SenderState.
         * @memberof clients
         * @classdesc Represents a SenderState.
         * @implements ISenderState
         * @constructor
         * @param {clients.ISenderState=} [properties] Properties to set
         */
        function SenderState(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SenderState senderKey.
         * @member {clients.ISenderKey|null|undefined} senderKey
         * @memberof clients.SenderState
         * @instance
         */
        SenderState.prototype.senderKey = null;

        /**
         * SenderState currentChainIndex.
         * @member {number} currentChainIndex
         * @memberof clients.SenderState
         * @instance
         */
        SenderState.prototype.currentChainIndex = 0;

        /**
         * Creates a new SenderState instance using the specified properties.
         * @function create
         * @memberof clients.SenderState
         * @static
         * @param {clients.ISenderState=} [properties] Properties to set
         * @returns {clients.SenderState} SenderState instance
         */
        SenderState.create = function create(properties) {
            return new SenderState(properties);
        };

        /**
         * Encodes the specified SenderState message. Does not implicitly {@link clients.SenderState.verify|verify} messages.
         * @function encode
         * @memberof clients.SenderState
         * @static
         * @param {clients.ISenderState} message SenderState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.senderKey != null && Object.hasOwnProperty.call(message, "senderKey"))
                $root.clients.SenderKey.encode(message.senderKey, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.currentChainIndex != null && Object.hasOwnProperty.call(message, "currentChainIndex"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.currentChainIndex);
            return writer;
        };

        /**
         * Encodes the specified SenderState message, length delimited. Does not implicitly {@link clients.SenderState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.SenderState
         * @static
         * @param {clients.ISenderState} message SenderState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SenderState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SenderState message from the specified reader or buffer.
         * @function decode
         * @memberof clients.SenderState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.SenderState} SenderState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderState.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.SenderState();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.senderKey = $root.clients.SenderKey.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.currentChainIndex = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SenderState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.SenderState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.SenderState} SenderState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SenderState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SenderState message.
         * @function verify
         * @memberof clients.SenderState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SenderState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.senderKey != null && message.hasOwnProperty("senderKey")) {
                let error = $root.clients.SenderKey.verify(message.senderKey);
                if (error)
                    return "senderKey." + error;
            }
            if (message.currentChainIndex != null && message.hasOwnProperty("currentChainIndex"))
                if (!$util.isInteger(message.currentChainIndex))
                    return "currentChainIndex: integer expected";
            return null;
        };

        /**
         * Creates a SenderState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.SenderState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.SenderState} SenderState
         */
        SenderState.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.SenderState)
                return object;
            let message = new $root.clients.SenderState();
            if (object.senderKey != null) {
                if (typeof object.senderKey !== "object")
                    throw TypeError(".clients.SenderState.senderKey: object expected");
                message.senderKey = $root.clients.SenderKey.fromObject(object.senderKey);
            }
            if (object.currentChainIndex != null)
                message.currentChainIndex = object.currentChainIndex | 0;
            return message;
        };

        /**
         * Creates a plain object from a SenderState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.SenderState
         * @static
         * @param {clients.SenderState} message SenderState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SenderState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.senderKey = null;
                object.currentChainIndex = 0;
            }
            if (message.senderKey != null && message.hasOwnProperty("senderKey"))
                object.senderKey = $root.clients.SenderKey.toObject(message.senderKey, options);
            if (message.currentChainIndex != null && message.hasOwnProperty("currentChainIndex"))
                object.currentChainIndex = message.currentChainIndex;
            return object;
        };

        /**
         * Converts this SenderState to JSON.
         * @function toJSON
         * @memberof clients.SenderState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SenderState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SenderState;
    })();

    clients.EncryptedPayload = (function() {

        /**
         * Properties of an EncryptedPayload.
         * @memberof clients
         * @interface IEncryptedPayload
         * @property {Uint8Array|null} [senderStateEncryptedPayload] EncryptedPayload senderStateEncryptedPayload
         * @property {Uint8Array|null} [oneToOneEncryptedPayload] EncryptedPayload oneToOneEncryptedPayload
         * @property {Uint8Array|null} [commentKeyEncryptedPayload] EncryptedPayload commentKeyEncryptedPayload
         */

        /**
         * Constructs a new EncryptedPayload.
         * @memberof clients
         * @classdesc Represents an EncryptedPayload.
         * @implements IEncryptedPayload
         * @constructor
         * @param {clients.IEncryptedPayload=} [properties] Properties to set
         */
        function EncryptedPayload(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EncryptedPayload senderStateEncryptedPayload.
         * @member {Uint8Array|null|undefined} senderStateEncryptedPayload
         * @memberof clients.EncryptedPayload
         * @instance
         */
        EncryptedPayload.prototype.senderStateEncryptedPayload = null;

        /**
         * EncryptedPayload oneToOneEncryptedPayload.
         * @member {Uint8Array|null|undefined} oneToOneEncryptedPayload
         * @memberof clients.EncryptedPayload
         * @instance
         */
        EncryptedPayload.prototype.oneToOneEncryptedPayload = null;

        /**
         * EncryptedPayload commentKeyEncryptedPayload.
         * @member {Uint8Array|null|undefined} commentKeyEncryptedPayload
         * @memberof clients.EncryptedPayload
         * @instance
         */
        EncryptedPayload.prototype.commentKeyEncryptedPayload = null;

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * EncryptedPayload payload.
         * @member {"senderStateEncryptedPayload"|"oneToOneEncryptedPayload"|"commentKeyEncryptedPayload"|undefined} payload
         * @memberof clients.EncryptedPayload
         * @instance
         */
        Object.defineProperty(EncryptedPayload.prototype, "payload", {
            get: $util.oneOfGetter($oneOfFields = ["senderStateEncryptedPayload", "oneToOneEncryptedPayload", "commentKeyEncryptedPayload"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new EncryptedPayload instance using the specified properties.
         * @function create
         * @memberof clients.EncryptedPayload
         * @static
         * @param {clients.IEncryptedPayload=} [properties] Properties to set
         * @returns {clients.EncryptedPayload} EncryptedPayload instance
         */
        EncryptedPayload.create = function create(properties) {
            return new EncryptedPayload(properties);
        };

        /**
         * Encodes the specified EncryptedPayload message. Does not implicitly {@link clients.EncryptedPayload.verify|verify} messages.
         * @function encode
         * @memberof clients.EncryptedPayload
         * @static
         * @param {clients.IEncryptedPayload} message EncryptedPayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EncryptedPayload.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.senderStateEncryptedPayload != null && Object.hasOwnProperty.call(message, "senderStateEncryptedPayload"))
                writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.senderStateEncryptedPayload);
            if (message.oneToOneEncryptedPayload != null && Object.hasOwnProperty.call(message, "oneToOneEncryptedPayload"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.oneToOneEncryptedPayload);
            if (message.commentKeyEncryptedPayload != null && Object.hasOwnProperty.call(message, "commentKeyEncryptedPayload"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.commentKeyEncryptedPayload);
            return writer;
        };

        /**
         * Encodes the specified EncryptedPayload message, length delimited. Does not implicitly {@link clients.EncryptedPayload.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.EncryptedPayload
         * @static
         * @param {clients.IEncryptedPayload} message EncryptedPayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EncryptedPayload.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EncryptedPayload message from the specified reader or buffer.
         * @function decode
         * @memberof clients.EncryptedPayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.EncryptedPayload} EncryptedPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EncryptedPayload.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.EncryptedPayload();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.senderStateEncryptedPayload = reader.bytes();
                    break;
                case 2:
                    message.oneToOneEncryptedPayload = reader.bytes();
                    break;
                case 3:
                    message.commentKeyEncryptedPayload = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EncryptedPayload message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.EncryptedPayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.EncryptedPayload} EncryptedPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EncryptedPayload.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EncryptedPayload message.
         * @function verify
         * @memberof clients.EncryptedPayload
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EncryptedPayload.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.senderStateEncryptedPayload != null && message.hasOwnProperty("senderStateEncryptedPayload")) {
                properties.payload = 1;
                if (!(message.senderStateEncryptedPayload && typeof message.senderStateEncryptedPayload.length === "number" || $util.isString(message.senderStateEncryptedPayload)))
                    return "senderStateEncryptedPayload: buffer expected";
            }
            if (message.oneToOneEncryptedPayload != null && message.hasOwnProperty("oneToOneEncryptedPayload")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                if (!(message.oneToOneEncryptedPayload && typeof message.oneToOneEncryptedPayload.length === "number" || $util.isString(message.oneToOneEncryptedPayload)))
                    return "oneToOneEncryptedPayload: buffer expected";
            }
            if (message.commentKeyEncryptedPayload != null && message.hasOwnProperty("commentKeyEncryptedPayload")) {
                if (properties.payload === 1)
                    return "payload: multiple values";
                properties.payload = 1;
                if (!(message.commentKeyEncryptedPayload && typeof message.commentKeyEncryptedPayload.length === "number" || $util.isString(message.commentKeyEncryptedPayload)))
                    return "commentKeyEncryptedPayload: buffer expected";
            }
            return null;
        };

        /**
         * Creates an EncryptedPayload message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.EncryptedPayload
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.EncryptedPayload} EncryptedPayload
         */
        EncryptedPayload.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.EncryptedPayload)
                return object;
            let message = new $root.clients.EncryptedPayload();
            if (object.senderStateEncryptedPayload != null)
                if (typeof object.senderStateEncryptedPayload === "string")
                    $util.base64.decode(object.senderStateEncryptedPayload, message.senderStateEncryptedPayload = $util.newBuffer($util.base64.length(object.senderStateEncryptedPayload)), 0);
                else if (object.senderStateEncryptedPayload.length)
                    message.senderStateEncryptedPayload = object.senderStateEncryptedPayload;
            if (object.oneToOneEncryptedPayload != null)
                if (typeof object.oneToOneEncryptedPayload === "string")
                    $util.base64.decode(object.oneToOneEncryptedPayload, message.oneToOneEncryptedPayload = $util.newBuffer($util.base64.length(object.oneToOneEncryptedPayload)), 0);
                else if (object.oneToOneEncryptedPayload.length)
                    message.oneToOneEncryptedPayload = object.oneToOneEncryptedPayload;
            if (object.commentKeyEncryptedPayload != null)
                if (typeof object.commentKeyEncryptedPayload === "string")
                    $util.base64.decode(object.commentKeyEncryptedPayload, message.commentKeyEncryptedPayload = $util.newBuffer($util.base64.length(object.commentKeyEncryptedPayload)), 0);
                else if (object.commentKeyEncryptedPayload.length)
                    message.commentKeyEncryptedPayload = object.commentKeyEncryptedPayload;
            return message;
        };

        /**
         * Creates a plain object from an EncryptedPayload message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.EncryptedPayload
         * @static
         * @param {clients.EncryptedPayload} message EncryptedPayload
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EncryptedPayload.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (message.senderStateEncryptedPayload != null && message.hasOwnProperty("senderStateEncryptedPayload")) {
                object.senderStateEncryptedPayload = options.bytes === String ? $util.base64.encode(message.senderStateEncryptedPayload, 0, message.senderStateEncryptedPayload.length) : options.bytes === Array ? Array.prototype.slice.call(message.senderStateEncryptedPayload) : message.senderStateEncryptedPayload;
                if (options.oneofs)
                    object.payload = "senderStateEncryptedPayload";
            }
            if (message.oneToOneEncryptedPayload != null && message.hasOwnProperty("oneToOneEncryptedPayload")) {
                object.oneToOneEncryptedPayload = options.bytes === String ? $util.base64.encode(message.oneToOneEncryptedPayload, 0, message.oneToOneEncryptedPayload.length) : options.bytes === Array ? Array.prototype.slice.call(message.oneToOneEncryptedPayload) : message.oneToOneEncryptedPayload;
                if (options.oneofs)
                    object.payload = "oneToOneEncryptedPayload";
            }
            if (message.commentKeyEncryptedPayload != null && message.hasOwnProperty("commentKeyEncryptedPayload")) {
                object.commentKeyEncryptedPayload = options.bytes === String ? $util.base64.encode(message.commentKeyEncryptedPayload, 0, message.commentKeyEncryptedPayload.length) : options.bytes === Array ? Array.prototype.slice.call(message.commentKeyEncryptedPayload) : message.commentKeyEncryptedPayload;
                if (options.oneofs)
                    object.payload = "commentKeyEncryptedPayload";
            }
            return object;
        };

        /**
         * Converts this EncryptedPayload to JSON.
         * @function toJSON
         * @memberof clients.EncryptedPayload
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EncryptedPayload.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EncryptedPayload;
    })();

    clients.VoiceNote = (function() {

        /**
         * Properties of a VoiceNote.
         * @memberof clients
         * @interface IVoiceNote
         * @property {clients.IEncryptedResource|null} [audio] VoiceNote audio
         */

        /**
         * Constructs a new VoiceNote.
         * @memberof clients
         * @classdesc Represents a VoiceNote.
         * @implements IVoiceNote
         * @constructor
         * @param {clients.IVoiceNote=} [properties] Properties to set
         */
        function VoiceNote(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * VoiceNote audio.
         * @member {clients.IEncryptedResource|null|undefined} audio
         * @memberof clients.VoiceNote
         * @instance
         */
        VoiceNote.prototype.audio = null;

        /**
         * Creates a new VoiceNote instance using the specified properties.
         * @function create
         * @memberof clients.VoiceNote
         * @static
         * @param {clients.IVoiceNote=} [properties] Properties to set
         * @returns {clients.VoiceNote} VoiceNote instance
         */
        VoiceNote.create = function create(properties) {
            return new VoiceNote(properties);
        };

        /**
         * Encodes the specified VoiceNote message. Does not implicitly {@link clients.VoiceNote.verify|verify} messages.
         * @function encode
         * @memberof clients.VoiceNote
         * @static
         * @param {clients.IVoiceNote} message VoiceNote message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VoiceNote.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.audio != null && Object.hasOwnProperty.call(message, "audio"))
                $root.clients.EncryptedResource.encode(message.audio, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified VoiceNote message, length delimited. Does not implicitly {@link clients.VoiceNote.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.VoiceNote
         * @static
         * @param {clients.IVoiceNote} message VoiceNote message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VoiceNote.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a VoiceNote message from the specified reader or buffer.
         * @function decode
         * @memberof clients.VoiceNote
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.VoiceNote} VoiceNote
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VoiceNote.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.VoiceNote();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.audio = $root.clients.EncryptedResource.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a VoiceNote message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.VoiceNote
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.VoiceNote} VoiceNote
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VoiceNote.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a VoiceNote message.
         * @function verify
         * @memberof clients.VoiceNote
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VoiceNote.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.audio != null && message.hasOwnProperty("audio")) {
                let error = $root.clients.EncryptedResource.verify(message.audio);
                if (error)
                    return "audio." + error;
            }
            return null;
        };

        /**
         * Creates a VoiceNote message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.VoiceNote
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.VoiceNote} VoiceNote
         */
        VoiceNote.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.VoiceNote)
                return object;
            let message = new $root.clients.VoiceNote();
            if (object.audio != null) {
                if (typeof object.audio !== "object")
                    throw TypeError(".clients.VoiceNote.audio: object expected");
                message.audio = $root.clients.EncryptedResource.fromObject(object.audio);
            }
            return message;
        };

        /**
         * Creates a plain object from a VoiceNote message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.VoiceNote
         * @static
         * @param {clients.VoiceNote} message VoiceNote
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VoiceNote.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.audio = null;
            if (message.audio != null && message.hasOwnProperty("audio"))
                object.audio = $root.clients.EncryptedResource.toObject(message.audio, options);
            return object;
        };

        /**
         * Converts this VoiceNote to JSON.
         * @function toJSON
         * @memberof clients.VoiceNote
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VoiceNote.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return VoiceNote;
    })();

    clients.Link = (function() {

        /**
         * Properties of a Link.
         * @memberof clients
         * @interface ILink
         * @property {string|null} [url] Link url
         * @property {string|null} [title] Link title
         * @property {string|null} [description] Link description
         * @property {Array.<clients.IImage>|null} [preview] Link preview
         */

        /**
         * Constructs a new Link.
         * @memberof clients
         * @classdesc Represents a Link.
         * @implements ILink
         * @constructor
         * @param {clients.ILink=} [properties] Properties to set
         */
        function Link(properties) {
            this.preview = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Link url.
         * @member {string} url
         * @memberof clients.Link
         * @instance
         */
        Link.prototype.url = "";

        /**
         * Link title.
         * @member {string} title
         * @memberof clients.Link
         * @instance
         */
        Link.prototype.title = "";

        /**
         * Link description.
         * @member {string} description
         * @memberof clients.Link
         * @instance
         */
        Link.prototype.description = "";

        /**
         * Link preview.
         * @member {Array.<clients.IImage>} preview
         * @memberof clients.Link
         * @instance
         */
        Link.prototype.preview = $util.emptyArray;

        /**
         * Creates a new Link instance using the specified properties.
         * @function create
         * @memberof clients.Link
         * @static
         * @param {clients.ILink=} [properties] Properties to set
         * @returns {clients.Link} Link instance
         */
        Link.create = function create(properties) {
            return new Link(properties);
        };

        /**
         * Encodes the specified Link message. Does not implicitly {@link clients.Link.verify|verify} messages.
         * @function encode
         * @memberof clients.Link
         * @static
         * @param {clients.ILink} message Link message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Link.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
            if (message.title != null && Object.hasOwnProperty.call(message, "title"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.title);
            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.description);
            if (message.preview != null && message.preview.length)
                for (let i = 0; i < message.preview.length; ++i)
                    $root.clients.Image.encode(message.preview[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Link message, length delimited. Does not implicitly {@link clients.Link.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.Link
         * @static
         * @param {clients.ILink} message Link message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Link.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Link message from the specified reader or buffer.
         * @function decode
         * @memberof clients.Link
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.Link} Link
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Link.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.Link();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.url = reader.string();
                    break;
                case 2:
                    message.title = reader.string();
                    break;
                case 3:
                    message.description = reader.string();
                    break;
                case 4:
                    if (!(message.preview && message.preview.length))
                        message.preview = [];
                    message.preview.push($root.clients.Image.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Link message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.Link
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.Link} Link
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Link.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Link message.
         * @function verify
         * @memberof clients.Link
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Link.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.url != null && message.hasOwnProperty("url"))
                if (!$util.isString(message.url))
                    return "url: string expected";
            if (message.title != null && message.hasOwnProperty("title"))
                if (!$util.isString(message.title))
                    return "title: string expected";
            if (message.description != null && message.hasOwnProperty("description"))
                if (!$util.isString(message.description))
                    return "description: string expected";
            if (message.preview != null && message.hasOwnProperty("preview")) {
                if (!Array.isArray(message.preview))
                    return "preview: array expected";
                for (let i = 0; i < message.preview.length; ++i) {
                    let error = $root.clients.Image.verify(message.preview[i]);
                    if (error)
                        return "preview." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Link message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.Link
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.Link} Link
         */
        Link.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.Link)
                return object;
            let message = new $root.clients.Link();
            if (object.url != null)
                message.url = String(object.url);
            if (object.title != null)
                message.title = String(object.title);
            if (object.description != null)
                message.description = String(object.description);
            if (object.preview) {
                if (!Array.isArray(object.preview))
                    throw TypeError(".clients.Link.preview: array expected");
                message.preview = [];
                for (let i = 0; i < object.preview.length; ++i) {
                    if (typeof object.preview[i] !== "object")
                        throw TypeError(".clients.Link.preview: object expected");
                    message.preview[i] = $root.clients.Image.fromObject(object.preview[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Link message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.Link
         * @static
         * @param {clients.Link} message Link
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Link.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.preview = [];
            if (options.defaults) {
                object.url = "";
                object.title = "";
                object.description = "";
            }
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = message.url;
            if (message.title != null && message.hasOwnProperty("title"))
                object.title = message.title;
            if (message.description != null && message.hasOwnProperty("description"))
                object.description = message.description;
            if (message.preview && message.preview.length) {
                object.preview = [];
                for (let j = 0; j < message.preview.length; ++j)
                    object.preview[j] = $root.clients.Image.toObject(message.preview[j], options);
            }
            return object;
        };

        /**
         * Converts this Link to JSON.
         * @function toJSON
         * @memberof clients.Link
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Link.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Link;
    })();

    clients.MemberDetails = (function() {

        /**
         * Properties of a MemberDetails.
         * @memberof clients
         * @interface IMemberDetails
         * @property {number|Long|null} [uid] MemberDetails uid
         * @property {Uint8Array|null} [publicIdentityKey] MemberDetails publicIdentityKey
         */

        /**
         * Constructs a new MemberDetails.
         * @memberof clients
         * @classdesc Represents a MemberDetails.
         * @implements IMemberDetails
         * @constructor
         * @param {clients.IMemberDetails=} [properties] Properties to set
         */
        function MemberDetails(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MemberDetails uid.
         * @member {number|Long} uid
         * @memberof clients.MemberDetails
         * @instance
         */
        MemberDetails.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * MemberDetails publicIdentityKey.
         * @member {Uint8Array} publicIdentityKey
         * @memberof clients.MemberDetails
         * @instance
         */
        MemberDetails.prototype.publicIdentityKey = $util.newBuffer([]);

        /**
         * Creates a new MemberDetails instance using the specified properties.
         * @function create
         * @memberof clients.MemberDetails
         * @static
         * @param {clients.IMemberDetails=} [properties] Properties to set
         * @returns {clients.MemberDetails} MemberDetails instance
         */
        MemberDetails.create = function create(properties) {
            return new MemberDetails(properties);
        };

        /**
         * Encodes the specified MemberDetails message. Does not implicitly {@link clients.MemberDetails.verify|verify} messages.
         * @function encode
         * @memberof clients.MemberDetails
         * @static
         * @param {clients.IMemberDetails} message MemberDetails message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MemberDetails.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.uid);
            if (message.publicIdentityKey != null && Object.hasOwnProperty.call(message, "publicIdentityKey"))
                writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.publicIdentityKey);
            return writer;
        };

        /**
         * Encodes the specified MemberDetails message, length delimited. Does not implicitly {@link clients.MemberDetails.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.MemberDetails
         * @static
         * @param {clients.IMemberDetails} message MemberDetails message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MemberDetails.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MemberDetails message from the specified reader or buffer.
         * @function decode
         * @memberof clients.MemberDetails
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.MemberDetails} MemberDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MemberDetails.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.MemberDetails();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.uid = reader.int64();
                    break;
                case 2:
                    message.publicIdentityKey = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MemberDetails message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.MemberDetails
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.MemberDetails} MemberDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MemberDetails.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MemberDetails message.
         * @function verify
         * @memberof clients.MemberDetails
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MemberDetails.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (!$util.isInteger(message.uid) && !(message.uid && $util.isInteger(message.uid.low) && $util.isInteger(message.uid.high)))
                    return "uid: integer|Long expected";
            if (message.publicIdentityKey != null && message.hasOwnProperty("publicIdentityKey"))
                if (!(message.publicIdentityKey && typeof message.publicIdentityKey.length === "number" || $util.isString(message.publicIdentityKey)))
                    return "publicIdentityKey: buffer expected";
            return null;
        };

        /**
         * Creates a MemberDetails message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.MemberDetails
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.MemberDetails} MemberDetails
         */
        MemberDetails.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.MemberDetails)
                return object;
            let message = new $root.clients.MemberDetails();
            if (object.uid != null)
                if ($util.Long)
                    (message.uid = $util.Long.fromValue(object.uid)).unsigned = false;
                else if (typeof object.uid === "string")
                    message.uid = parseInt(object.uid, 10);
                else if (typeof object.uid === "number")
                    message.uid = object.uid;
                else if (typeof object.uid === "object")
                    message.uid = new $util.LongBits(object.uid.low >>> 0, object.uid.high >>> 0).toNumber();
            if (object.publicIdentityKey != null)
                if (typeof object.publicIdentityKey === "string")
                    $util.base64.decode(object.publicIdentityKey, message.publicIdentityKey = $util.newBuffer($util.base64.length(object.publicIdentityKey)), 0);
                else if (object.publicIdentityKey.length)
                    message.publicIdentityKey = object.publicIdentityKey;
            return message;
        };

        /**
         * Creates a plain object from a MemberDetails message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.MemberDetails
         * @static
         * @param {clients.MemberDetails} message MemberDetails
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MemberDetails.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.uid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.uid = options.longs === String ? "0" : 0;
                if (options.bytes === String)
                    object.publicIdentityKey = "";
                else {
                    object.publicIdentityKey = [];
                    if (options.bytes !== Array)
                        object.publicIdentityKey = $util.newBuffer(object.publicIdentityKey);
                }
            }
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (typeof message.uid === "number")
                    object.uid = options.longs === String ? String(message.uid) : message.uid;
                else
                    object.uid = options.longs === String ? $util.Long.prototype.toString.call(message.uid) : options.longs === Number ? new $util.LongBits(message.uid.low >>> 0, message.uid.high >>> 0).toNumber() : message.uid;
            if (message.publicIdentityKey != null && message.hasOwnProperty("publicIdentityKey"))
                object.publicIdentityKey = options.bytes === String ? $util.base64.encode(message.publicIdentityKey, 0, message.publicIdentityKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.publicIdentityKey) : message.publicIdentityKey;
            return object;
        };

        /**
         * Converts this MemberDetails to JSON.
         * @function toJSON
         * @memberof clients.MemberDetails
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MemberDetails.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MemberDetails;
    })();

    clients.PostIdContext = (function() {

        /**
         * Properties of a PostIdContext.
         * @memberof clients
         * @interface IPostIdContext
         * @property {string|null} [feedPostId] PostIdContext feedPostId
         */

        /**
         * Constructs a new PostIdContext.
         * @memberof clients
         * @classdesc Represents a PostIdContext.
         * @implements IPostIdContext
         * @constructor
         * @param {clients.IPostIdContext=} [properties] Properties to set
         */
        function PostIdContext(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PostIdContext feedPostId.
         * @member {string} feedPostId
         * @memberof clients.PostIdContext
         * @instance
         */
        PostIdContext.prototype.feedPostId = "";

        /**
         * Creates a new PostIdContext instance using the specified properties.
         * @function create
         * @memberof clients.PostIdContext
         * @static
         * @param {clients.IPostIdContext=} [properties] Properties to set
         * @returns {clients.PostIdContext} PostIdContext instance
         */
        PostIdContext.create = function create(properties) {
            return new PostIdContext(properties);
        };

        /**
         * Encodes the specified PostIdContext message. Does not implicitly {@link clients.PostIdContext.verify|verify} messages.
         * @function encode
         * @memberof clients.PostIdContext
         * @static
         * @param {clients.IPostIdContext} message PostIdContext message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PostIdContext.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.feedPostId != null && Object.hasOwnProperty.call(message, "feedPostId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.feedPostId);
            return writer;
        };

        /**
         * Encodes the specified PostIdContext message, length delimited. Does not implicitly {@link clients.PostIdContext.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.PostIdContext
         * @static
         * @param {clients.IPostIdContext} message PostIdContext message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PostIdContext.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PostIdContext message from the specified reader or buffer.
         * @function decode
         * @memberof clients.PostIdContext
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.PostIdContext} PostIdContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PostIdContext.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.PostIdContext();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.feedPostId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PostIdContext message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.PostIdContext
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.PostIdContext} PostIdContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PostIdContext.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PostIdContext message.
         * @function verify
         * @memberof clients.PostIdContext
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PostIdContext.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.feedPostId != null && message.hasOwnProperty("feedPostId"))
                if (!$util.isString(message.feedPostId))
                    return "feedPostId: string expected";
            return null;
        };

        /**
         * Creates a PostIdContext message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.PostIdContext
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.PostIdContext} PostIdContext
         */
        PostIdContext.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.PostIdContext)
                return object;
            let message = new $root.clients.PostIdContext();
            if (object.feedPostId != null)
                message.feedPostId = String(object.feedPostId);
            return message;
        };

        /**
         * Creates a plain object from a PostIdContext message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.PostIdContext
         * @static
         * @param {clients.PostIdContext} message PostIdContext
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PostIdContext.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.feedPostId = "";
            if (message.feedPostId != null && message.hasOwnProperty("feedPostId"))
                object.feedPostId = message.feedPostId;
            return object;
        };

        /**
         * Converts this PostIdContext to JSON.
         * @function toJSON
         * @memberof clients.PostIdContext
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PostIdContext.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PostIdContext;
    })();

    clients.CommentIdContext = (function() {

        /**
         * Properties of a CommentIdContext.
         * @memberof clients
         * @interface ICommentIdContext
         * @property {string|null} [commentId] CommentIdContext commentId
         * @property {string|null} [feedPostId] CommentIdContext feedPostId
         * @property {string|null} [parentCommentId] CommentIdContext parentCommentId
         */

        /**
         * Constructs a new CommentIdContext.
         * @memberof clients
         * @classdesc Represents a CommentIdContext.
         * @implements ICommentIdContext
         * @constructor
         * @param {clients.ICommentIdContext=} [properties] Properties to set
         */
        function CommentIdContext(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CommentIdContext commentId.
         * @member {string} commentId
         * @memberof clients.CommentIdContext
         * @instance
         */
        CommentIdContext.prototype.commentId = "";

        /**
         * CommentIdContext feedPostId.
         * @member {string} feedPostId
         * @memberof clients.CommentIdContext
         * @instance
         */
        CommentIdContext.prototype.feedPostId = "";

        /**
         * CommentIdContext parentCommentId.
         * @member {string} parentCommentId
         * @memberof clients.CommentIdContext
         * @instance
         */
        CommentIdContext.prototype.parentCommentId = "";

        /**
         * Creates a new CommentIdContext instance using the specified properties.
         * @function create
         * @memberof clients.CommentIdContext
         * @static
         * @param {clients.ICommentIdContext=} [properties] Properties to set
         * @returns {clients.CommentIdContext} CommentIdContext instance
         */
        CommentIdContext.create = function create(properties) {
            return new CommentIdContext(properties);
        };

        /**
         * Encodes the specified CommentIdContext message. Does not implicitly {@link clients.CommentIdContext.verify|verify} messages.
         * @function encode
         * @memberof clients.CommentIdContext
         * @static
         * @param {clients.ICommentIdContext} message CommentIdContext message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommentIdContext.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.commentId != null && Object.hasOwnProperty.call(message, "commentId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.commentId);
            if (message.feedPostId != null && Object.hasOwnProperty.call(message, "feedPostId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.feedPostId);
            if (message.parentCommentId != null && Object.hasOwnProperty.call(message, "parentCommentId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.parentCommentId);
            return writer;
        };

        /**
         * Encodes the specified CommentIdContext message, length delimited. Does not implicitly {@link clients.CommentIdContext.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.CommentIdContext
         * @static
         * @param {clients.ICommentIdContext} message CommentIdContext message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommentIdContext.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CommentIdContext message from the specified reader or buffer.
         * @function decode
         * @memberof clients.CommentIdContext
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.CommentIdContext} CommentIdContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommentIdContext.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.CommentIdContext();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.commentId = reader.string();
                    break;
                case 2:
                    message.feedPostId = reader.string();
                    break;
                case 3:
                    message.parentCommentId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CommentIdContext message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.CommentIdContext
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.CommentIdContext} CommentIdContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommentIdContext.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CommentIdContext message.
         * @function verify
         * @memberof clients.CommentIdContext
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CommentIdContext.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.commentId != null && message.hasOwnProperty("commentId"))
                if (!$util.isString(message.commentId))
                    return "commentId: string expected";
            if (message.feedPostId != null && message.hasOwnProperty("feedPostId"))
                if (!$util.isString(message.feedPostId))
                    return "feedPostId: string expected";
            if (message.parentCommentId != null && message.hasOwnProperty("parentCommentId"))
                if (!$util.isString(message.parentCommentId))
                    return "parentCommentId: string expected";
            return null;
        };

        /**
         * Creates a CommentIdContext message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.CommentIdContext
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.CommentIdContext} CommentIdContext
         */
        CommentIdContext.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.CommentIdContext)
                return object;
            let message = new $root.clients.CommentIdContext();
            if (object.commentId != null)
                message.commentId = String(object.commentId);
            if (object.feedPostId != null)
                message.feedPostId = String(object.feedPostId);
            if (object.parentCommentId != null)
                message.parentCommentId = String(object.parentCommentId);
            return message;
        };

        /**
         * Creates a plain object from a CommentIdContext message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.CommentIdContext
         * @static
         * @param {clients.CommentIdContext} message CommentIdContext
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CommentIdContext.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.commentId = "";
                object.feedPostId = "";
                object.parentCommentId = "";
            }
            if (message.commentId != null && message.hasOwnProperty("commentId"))
                object.commentId = message.commentId;
            if (message.feedPostId != null && message.hasOwnProperty("feedPostId"))
                object.feedPostId = message.feedPostId;
            if (message.parentCommentId != null && message.hasOwnProperty("parentCommentId"))
                object.parentCommentId = message.parentCommentId;
            return object;
        };

        /**
         * Converts this CommentIdContext to JSON.
         * @function toJSON
         * @memberof clients.CommentIdContext
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CommentIdContext.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CommentIdContext;
    })();

    clients.ContentDetails = (function() {

        /**
         * Properties of a ContentDetails.
         * @memberof clients
         * @interface IContentDetails
         * @property {clients.IPostIdContext|null} [postIdContext] ContentDetails postIdContext
         * @property {clients.ICommentIdContext|null} [commentIdContext] ContentDetails commentIdContext
         * @property {Uint8Array|null} [contentHash] ContentDetails contentHash
         */

        /**
         * Constructs a new ContentDetails.
         * @memberof clients
         * @classdesc Represents a ContentDetails.
         * @implements IContentDetails
         * @constructor
         * @param {clients.IContentDetails=} [properties] Properties to set
         */
        function ContentDetails(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ContentDetails postIdContext.
         * @member {clients.IPostIdContext|null|undefined} postIdContext
         * @memberof clients.ContentDetails
         * @instance
         */
        ContentDetails.prototype.postIdContext = null;

        /**
         * ContentDetails commentIdContext.
         * @member {clients.ICommentIdContext|null|undefined} commentIdContext
         * @memberof clients.ContentDetails
         * @instance
         */
        ContentDetails.prototype.commentIdContext = null;

        /**
         * ContentDetails contentHash.
         * @member {Uint8Array} contentHash
         * @memberof clients.ContentDetails
         * @instance
         */
        ContentDetails.prototype.contentHash = $util.newBuffer([]);

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        /**
         * ContentDetails contentId.
         * @member {"postIdContext"|"commentIdContext"|undefined} contentId
         * @memberof clients.ContentDetails
         * @instance
         */
        Object.defineProperty(ContentDetails.prototype, "contentId", {
            get: $util.oneOfGetter($oneOfFields = ["postIdContext", "commentIdContext"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new ContentDetails instance using the specified properties.
         * @function create
         * @memberof clients.ContentDetails
         * @static
         * @param {clients.IContentDetails=} [properties] Properties to set
         * @returns {clients.ContentDetails} ContentDetails instance
         */
        ContentDetails.create = function create(properties) {
            return new ContentDetails(properties);
        };

        /**
         * Encodes the specified ContentDetails message. Does not implicitly {@link clients.ContentDetails.verify|verify} messages.
         * @function encode
         * @memberof clients.ContentDetails
         * @static
         * @param {clients.IContentDetails} message ContentDetails message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContentDetails.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.postIdContext != null && Object.hasOwnProperty.call(message, "postIdContext"))
                $root.clients.PostIdContext.encode(message.postIdContext, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.commentIdContext != null && Object.hasOwnProperty.call(message, "commentIdContext"))
                $root.clients.CommentIdContext.encode(message.commentIdContext, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.contentHash != null && Object.hasOwnProperty.call(message, "contentHash"))
                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.contentHash);
            return writer;
        };

        /**
         * Encodes the specified ContentDetails message, length delimited. Does not implicitly {@link clients.ContentDetails.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.ContentDetails
         * @static
         * @param {clients.IContentDetails} message ContentDetails message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContentDetails.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ContentDetails message from the specified reader or buffer.
         * @function decode
         * @memberof clients.ContentDetails
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.ContentDetails} ContentDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContentDetails.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.ContentDetails();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.postIdContext = $root.clients.PostIdContext.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.commentIdContext = $root.clients.CommentIdContext.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.contentHash = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ContentDetails message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.ContentDetails
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.ContentDetails} ContentDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContentDetails.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ContentDetails message.
         * @function verify
         * @memberof clients.ContentDetails
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ContentDetails.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message.postIdContext != null && message.hasOwnProperty("postIdContext")) {
                properties.contentId = 1;
                {
                    let error = $root.clients.PostIdContext.verify(message.postIdContext);
                    if (error)
                        return "postIdContext." + error;
                }
            }
            if (message.commentIdContext != null && message.hasOwnProperty("commentIdContext")) {
                if (properties.contentId === 1)
                    return "contentId: multiple values";
                properties.contentId = 1;
                {
                    let error = $root.clients.CommentIdContext.verify(message.commentIdContext);
                    if (error)
                        return "commentIdContext." + error;
                }
            }
            if (message.contentHash != null && message.hasOwnProperty("contentHash"))
                if (!(message.contentHash && typeof message.contentHash.length === "number" || $util.isString(message.contentHash)))
                    return "contentHash: buffer expected";
            return null;
        };

        /**
         * Creates a ContentDetails message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.ContentDetails
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.ContentDetails} ContentDetails
         */
        ContentDetails.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.ContentDetails)
                return object;
            let message = new $root.clients.ContentDetails();
            if (object.postIdContext != null) {
                if (typeof object.postIdContext !== "object")
                    throw TypeError(".clients.ContentDetails.postIdContext: object expected");
                message.postIdContext = $root.clients.PostIdContext.fromObject(object.postIdContext);
            }
            if (object.commentIdContext != null) {
                if (typeof object.commentIdContext !== "object")
                    throw TypeError(".clients.ContentDetails.commentIdContext: object expected");
                message.commentIdContext = $root.clients.CommentIdContext.fromObject(object.commentIdContext);
            }
            if (object.contentHash != null)
                if (typeof object.contentHash === "string")
                    $util.base64.decode(object.contentHash, message.contentHash = $util.newBuffer($util.base64.length(object.contentHash)), 0);
                else if (object.contentHash.length)
                    message.contentHash = object.contentHash;
            return message;
        };

        /**
         * Creates a plain object from a ContentDetails message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.ContentDetails
         * @static
         * @param {clients.ContentDetails} message ContentDetails
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ContentDetails.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                if (options.bytes === String)
                    object.contentHash = "";
                else {
                    object.contentHash = [];
                    if (options.bytes !== Array)
                        object.contentHash = $util.newBuffer(object.contentHash);
                }
            if (message.postIdContext != null && message.hasOwnProperty("postIdContext")) {
                object.postIdContext = $root.clients.PostIdContext.toObject(message.postIdContext, options);
                if (options.oneofs)
                    object.contentId = "postIdContext";
            }
            if (message.commentIdContext != null && message.hasOwnProperty("commentIdContext")) {
                object.commentIdContext = $root.clients.CommentIdContext.toObject(message.commentIdContext, options);
                if (options.oneofs)
                    object.contentId = "commentIdContext";
            }
            if (message.contentHash != null && message.hasOwnProperty("contentHash"))
                object.contentHash = options.bytes === String ? $util.base64.encode(message.contentHash, 0, message.contentHash.length) : options.bytes === Array ? Array.prototype.slice.call(message.contentHash) : message.contentHash;
            return object;
        };

        /**
         * Converts this ContentDetails to JSON.
         * @function toJSON
         * @memberof clients.ContentDetails
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ContentDetails.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ContentDetails;
    })();

    clients.GroupHistoryPayload = (function() {

        /**
         * Properties of a GroupHistoryPayload.
         * @memberof clients
         * @interface IGroupHistoryPayload
         * @property {Array.<clients.IMemberDetails>|null} [memberDetails] GroupHistoryPayload memberDetails
         * @property {Array.<clients.IContentDetails>|null} [contentDetails] GroupHistoryPayload contentDetails
         */

        /**
         * Constructs a new GroupHistoryPayload.
         * @memberof clients
         * @classdesc Represents a GroupHistoryPayload.
         * @implements IGroupHistoryPayload
         * @constructor
         * @param {clients.IGroupHistoryPayload=} [properties] Properties to set
         */
        function GroupHistoryPayload(properties) {
            this.memberDetails = [];
            this.contentDetails = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GroupHistoryPayload memberDetails.
         * @member {Array.<clients.IMemberDetails>} memberDetails
         * @memberof clients.GroupHistoryPayload
         * @instance
         */
        GroupHistoryPayload.prototype.memberDetails = $util.emptyArray;

        /**
         * GroupHistoryPayload contentDetails.
         * @member {Array.<clients.IContentDetails>} contentDetails
         * @memberof clients.GroupHistoryPayload
         * @instance
         */
        GroupHistoryPayload.prototype.contentDetails = $util.emptyArray;

        /**
         * Creates a new GroupHistoryPayload instance using the specified properties.
         * @function create
         * @memberof clients.GroupHistoryPayload
         * @static
         * @param {clients.IGroupHistoryPayload=} [properties] Properties to set
         * @returns {clients.GroupHistoryPayload} GroupHistoryPayload instance
         */
        GroupHistoryPayload.create = function create(properties) {
            return new GroupHistoryPayload(properties);
        };

        /**
         * Encodes the specified GroupHistoryPayload message. Does not implicitly {@link clients.GroupHistoryPayload.verify|verify} messages.
         * @function encode
         * @memberof clients.GroupHistoryPayload
         * @static
         * @param {clients.IGroupHistoryPayload} message GroupHistoryPayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GroupHistoryPayload.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.memberDetails != null && message.memberDetails.length)
                for (let i = 0; i < message.memberDetails.length; ++i)
                    $root.clients.MemberDetails.encode(message.memberDetails[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.contentDetails != null && message.contentDetails.length)
                for (let i = 0; i < message.contentDetails.length; ++i)
                    $root.clients.ContentDetails.encode(message.contentDetails[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified GroupHistoryPayload message, length delimited. Does not implicitly {@link clients.GroupHistoryPayload.verify|verify} messages.
         * @function encodeDelimited
         * @memberof clients.GroupHistoryPayload
         * @static
         * @param {clients.IGroupHistoryPayload} message GroupHistoryPayload message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GroupHistoryPayload.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GroupHistoryPayload message from the specified reader or buffer.
         * @function decode
         * @memberof clients.GroupHistoryPayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {clients.GroupHistoryPayload} GroupHistoryPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GroupHistoryPayload.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.clients.GroupHistoryPayload();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.memberDetails && message.memberDetails.length))
                        message.memberDetails = [];
                    message.memberDetails.push($root.clients.MemberDetails.decode(reader, reader.uint32()));
                    break;
                case 2:
                    if (!(message.contentDetails && message.contentDetails.length))
                        message.contentDetails = [];
                    message.contentDetails.push($root.clients.ContentDetails.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a GroupHistoryPayload message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof clients.GroupHistoryPayload
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {clients.GroupHistoryPayload} GroupHistoryPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GroupHistoryPayload.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GroupHistoryPayload message.
         * @function verify
         * @memberof clients.GroupHistoryPayload
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GroupHistoryPayload.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.memberDetails != null && message.hasOwnProperty("memberDetails")) {
                if (!Array.isArray(message.memberDetails))
                    return "memberDetails: array expected";
                for (let i = 0; i < message.memberDetails.length; ++i) {
                    let error = $root.clients.MemberDetails.verify(message.memberDetails[i]);
                    if (error)
                        return "memberDetails." + error;
                }
            }
            if (message.contentDetails != null && message.hasOwnProperty("contentDetails")) {
                if (!Array.isArray(message.contentDetails))
                    return "contentDetails: array expected";
                for (let i = 0; i < message.contentDetails.length; ++i) {
                    let error = $root.clients.ContentDetails.verify(message.contentDetails[i]);
                    if (error)
                        return "contentDetails." + error;
                }
            }
            return null;
        };

        /**
         * Creates a GroupHistoryPayload message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof clients.GroupHistoryPayload
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {clients.GroupHistoryPayload} GroupHistoryPayload
         */
        GroupHistoryPayload.fromObject = function fromObject(object) {
            if (object instanceof $root.clients.GroupHistoryPayload)
                return object;
            let message = new $root.clients.GroupHistoryPayload();
            if (object.memberDetails) {
                if (!Array.isArray(object.memberDetails))
                    throw TypeError(".clients.GroupHistoryPayload.memberDetails: array expected");
                message.memberDetails = [];
                for (let i = 0; i < object.memberDetails.length; ++i) {
                    if (typeof object.memberDetails[i] !== "object")
                        throw TypeError(".clients.GroupHistoryPayload.memberDetails: object expected");
                    message.memberDetails[i] = $root.clients.MemberDetails.fromObject(object.memberDetails[i]);
                }
            }
            if (object.contentDetails) {
                if (!Array.isArray(object.contentDetails))
                    throw TypeError(".clients.GroupHistoryPayload.contentDetails: array expected");
                message.contentDetails = [];
                for (let i = 0; i < object.contentDetails.length; ++i) {
                    if (typeof object.contentDetails[i] !== "object")
                        throw TypeError(".clients.GroupHistoryPayload.contentDetails: object expected");
                    message.contentDetails[i] = $root.clients.ContentDetails.fromObject(object.contentDetails[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a GroupHistoryPayload message. Also converts values to other types if specified.
         * @function toObject
         * @memberof clients.GroupHistoryPayload
         * @static
         * @param {clients.GroupHistoryPayload} message GroupHistoryPayload
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GroupHistoryPayload.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.memberDetails = [];
                object.contentDetails = [];
            }
            if (message.memberDetails && message.memberDetails.length) {
                object.memberDetails = [];
                for (let j = 0; j < message.memberDetails.length; ++j)
                    object.memberDetails[j] = $root.clients.MemberDetails.toObject(message.memberDetails[j], options);
            }
            if (message.contentDetails && message.contentDetails.length) {
                object.contentDetails = [];
                for (let j = 0; j < message.contentDetails.length; ++j)
                    object.contentDetails[j] = $root.clients.ContentDetails.toObject(message.contentDetails[j], options);
            }
            return object;
        };

        /**
         * Converts this GroupHistoryPayload to JSON.
         * @function toJSON
         * @memberof clients.GroupHistoryPayload
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GroupHistoryPayload.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return GroupHistoryPayload;
    })();

    return clients;
})();

export { $root as default };
