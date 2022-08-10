import * as $protobuf from "protobufjs";
/** Namespace clients. */
export namespace clients {

    /** MediaType enum. */
    enum MediaType {
        MEDIA_TYPE_UNSPECIFIED = 0,
        MEDIA_TYPE_IMAGE = 1,
        MEDIA_TYPE_VIDEO = 2,
        MEDIA_TYPE_AUDIO = 3
    }

    /** BlobVersion enum. */
    enum BlobVersion {
        BLOB_VERSION_DEFAULT = 0,
        BLOB_VERSION_CHUNKED = 1
    }

    /** Properties of a Media. */
    interface IMedia {

        /** Media type */
        type?: (clients.MediaType|null);

        /** Media width */
        width?: (number|null);

        /** Media height */
        height?: (number|null);

        /** Media encryptionKey */
        encryptionKey?: (Uint8Array|null);

        /** Media ciphertextHash */
        ciphertextHash?: (Uint8Array|null);

        /** Media downloadUrl */
        downloadUrl?: (string|null);

        /** Media blobVersion */
        blobVersion?: (clients.BlobVersion|null);

        /** Media chunkSize */
        chunkSize?: (number|null);

        /** Media blobSize */
        blobSize?: (number|Long|null);
    }

    /** Represents a Media. */
    class Media implements IMedia {

        /**
         * Constructs a new Media.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IMedia);

        /** Media type. */
        public type: clients.MediaType;

        /** Media width. */
        public width: number;

        /** Media height. */
        public height: number;

        /** Media encryptionKey. */
        public encryptionKey: Uint8Array;

        /** Media ciphertextHash. */
        public ciphertextHash: Uint8Array;

        /** Media downloadUrl. */
        public downloadUrl: string;

        /** Media blobVersion. */
        public blobVersion: clients.BlobVersion;

        /** Media chunkSize. */
        public chunkSize: number;

        /** Media blobSize. */
        public blobSize: (number|Long);

        /**
         * Creates a new Media instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Media instance
         */
        public static create(properties?: clients.IMedia): clients.Media;

        /**
         * Encodes the specified Media message. Does not implicitly {@link clients.Media.verify|verify} messages.
         * @param message Media message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IMedia, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Media message, length delimited. Does not implicitly {@link clients.Media.verify|verify} messages.
         * @param message Media message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IMedia, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Media message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Media
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Media;

        /**
         * Decodes a Media message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Media
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Media;

        /**
         * Verifies a Media message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Media message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Media
         */
        public static fromObject(object: { [k: string]: any }): clients.Media;

        /**
         * Creates a plain object from a Media message. Also converts values to other types if specified.
         * @param message Media
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Media, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Media to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EncryptedResource. */
    interface IEncryptedResource {

        /** EncryptedResource encryptionKey */
        encryptionKey?: (Uint8Array|null);

        /** EncryptedResource ciphertextHash */
        ciphertextHash?: (Uint8Array|null);

        /** EncryptedResource downloadUrl */
        downloadUrl?: (string|null);
    }

    /** Represents an EncryptedResource. */
    class EncryptedResource implements IEncryptedResource {

        /**
         * Constructs a new EncryptedResource.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IEncryptedResource);

        /** EncryptedResource encryptionKey. */
        public encryptionKey: Uint8Array;

        /** EncryptedResource ciphertextHash. */
        public ciphertextHash: Uint8Array;

        /** EncryptedResource downloadUrl. */
        public downloadUrl: string;

        /**
         * Creates a new EncryptedResource instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EncryptedResource instance
         */
        public static create(properties?: clients.IEncryptedResource): clients.EncryptedResource;

        /**
         * Encodes the specified EncryptedResource message. Does not implicitly {@link clients.EncryptedResource.verify|verify} messages.
         * @param message EncryptedResource message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IEncryptedResource, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EncryptedResource message, length delimited. Does not implicitly {@link clients.EncryptedResource.verify|verify} messages.
         * @param message EncryptedResource message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IEncryptedResource, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EncryptedResource message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EncryptedResource
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.EncryptedResource;

        /**
         * Decodes an EncryptedResource message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EncryptedResource
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.EncryptedResource;

        /**
         * Verifies an EncryptedResource message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EncryptedResource message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EncryptedResource
         */
        public static fromObject(object: { [k: string]: any }): clients.EncryptedResource;

        /**
         * Creates a plain object from an EncryptedResource message. Also converts values to other types if specified.
         * @param message EncryptedResource
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.EncryptedResource, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EncryptedResource to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Mention. */
    interface IMention {

        /** Mention index */
        index?: (number|null);

        /** Mention userId */
        userId?: (string|null);

        /** Mention name */
        name?: (string|null);
    }

    /** Represents a Mention. */
    class Mention implements IMention {

        /**
         * Constructs a new Mention.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IMention);

        /** Mention index. */
        public index: number;

        /** Mention userId. */
        public userId: string;

        /** Mention name. */
        public name: string;

        /**
         * Creates a new Mention instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Mention instance
         */
        public static create(properties?: clients.IMention): clients.Mention;

        /**
         * Encodes the specified Mention message. Does not implicitly {@link clients.Mention.verify|verify} messages.
         * @param message Mention message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IMention, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Mention message, length delimited. Does not implicitly {@link clients.Mention.verify|verify} messages.
         * @param message Mention message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IMention, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Mention message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Mention
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Mention;

        /**
         * Decodes a Mention message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Mention
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Mention;

        /**
         * Verifies a Mention message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Mention message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Mention
         */
        public static fromObject(object: { [k: string]: any }): clients.Mention;

        /**
         * Creates a plain object from a Mention message. Also converts values to other types if specified.
         * @param message Mention
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Mention, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Mention to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** PhoneType enum. */
    enum PhoneType {
        PHONE_TYPE_UNSPECIFIED = 0,
        PHONE_TYPE_MOBILE = 1,
        PHONE_TYPE_HOME = 2,
        PHONE_TYPE_WORK = 3
    }

    /** Properties of a Phone. */
    interface IPhone {

        /** Phone type */
        type?: (clients.PhoneType|null);

        /** Phone number */
        number?: (string|null);
    }

    /** Represents a Phone. */
    class Phone implements IPhone {

        /**
         * Constructs a new Phone.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IPhone);

        /** Phone type. */
        public type: clients.PhoneType;

        /** Phone number. */
        public number: string;

        /**
         * Creates a new Phone instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Phone instance
         */
        public static create(properties?: clients.IPhone): clients.Phone;

        /**
         * Encodes the specified Phone message. Does not implicitly {@link clients.Phone.verify|verify} messages.
         * @param message Phone message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IPhone, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Phone message, length delimited. Does not implicitly {@link clients.Phone.verify|verify} messages.
         * @param message Phone message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IPhone, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Phone message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Phone
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Phone;

        /**
         * Decodes a Phone message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Phone
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Phone;

        /**
         * Verifies a Phone message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Phone message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Phone
         */
        public static fromObject(object: { [k: string]: any }): clients.Phone;

        /**
         * Creates a plain object from a Phone message. Also converts values to other types if specified.
         * @param message Phone
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Phone, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Phone to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SignedPreKey. */
    interface ISignedPreKey {

        /** SignedPreKey id */
        id?: (number|null);

        /** SignedPreKey publicKey */
        publicKey?: (Uint8Array|null);

        /** SignedPreKey signature */
        signature?: (Uint8Array|null);
    }

    /** Represents a SignedPreKey. */
    class SignedPreKey implements ISignedPreKey {

        /**
         * Constructs a new SignedPreKey.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.ISignedPreKey);

        /** SignedPreKey id. */
        public id: number;

        /** SignedPreKey publicKey. */
        public publicKey: Uint8Array;

        /** SignedPreKey signature. */
        public signature: Uint8Array;

        /**
         * Creates a new SignedPreKey instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SignedPreKey instance
         */
        public static create(properties?: clients.ISignedPreKey): clients.SignedPreKey;

        /**
         * Encodes the specified SignedPreKey message. Does not implicitly {@link clients.SignedPreKey.verify|verify} messages.
         * @param message SignedPreKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.ISignedPreKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SignedPreKey message, length delimited. Does not implicitly {@link clients.SignedPreKey.verify|verify} messages.
         * @param message SignedPreKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.ISignedPreKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SignedPreKey message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SignedPreKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.SignedPreKey;

        /**
         * Decodes a SignedPreKey message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SignedPreKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.SignedPreKey;

        /**
         * Verifies a SignedPreKey message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SignedPreKey message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SignedPreKey
         */
        public static fromObject(object: { [k: string]: any }): clients.SignedPreKey;

        /**
         * Creates a plain object from a SignedPreKey message. Also converts values to other types if specified.
         * @param message SignedPreKey
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.SignedPreKey, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SignedPreKey to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an OneTimePreKey. */
    interface IOneTimePreKey {

        /** OneTimePreKey id */
        id?: (number|null);

        /** OneTimePreKey publicKey */
        publicKey?: (Uint8Array|null);
    }

    /** Represents an OneTimePreKey. */
    class OneTimePreKey implements IOneTimePreKey {

        /**
         * Constructs a new OneTimePreKey.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IOneTimePreKey);

        /** OneTimePreKey id. */
        public id: number;

        /** OneTimePreKey publicKey. */
        public publicKey: Uint8Array;

        /**
         * Creates a new OneTimePreKey instance using the specified properties.
         * @param [properties] Properties to set
         * @returns OneTimePreKey instance
         */
        public static create(properties?: clients.IOneTimePreKey): clients.OneTimePreKey;

        /**
         * Encodes the specified OneTimePreKey message. Does not implicitly {@link clients.OneTimePreKey.verify|verify} messages.
         * @param message OneTimePreKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IOneTimePreKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified OneTimePreKey message, length delimited. Does not implicitly {@link clients.OneTimePreKey.verify|verify} messages.
         * @param message OneTimePreKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IOneTimePreKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an OneTimePreKey message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns OneTimePreKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.OneTimePreKey;

        /**
         * Decodes an OneTimePreKey message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns OneTimePreKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.OneTimePreKey;

        /**
         * Verifies an OneTimePreKey message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an OneTimePreKey message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns OneTimePreKey
         */
        public static fromObject(object: { [k: string]: any }): clients.OneTimePreKey;

        /**
         * Creates a plain object from an OneTimePreKey message. Also converts values to other types if specified.
         * @param message OneTimePreKey
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.OneTimePreKey, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this OneTimePreKey to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Background. */
    interface IBackground {

        /** Background theme */
        theme?: (number|null);
    }

    /** Represents a Background. */
    class Background implements IBackground {

        /**
         * Constructs a new Background.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IBackground);

        /** Background theme. */
        public theme: number;

        /**
         * Creates a new Background instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Background instance
         */
        public static create(properties?: clients.IBackground): clients.Background;

        /**
         * Encodes the specified Background message. Does not implicitly {@link clients.Background.verify|verify} messages.
         * @param message Background message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IBackground, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Background message, length delimited. Does not implicitly {@link clients.Background.verify|verify} messages.
         * @param message Background message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IBackground, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Background message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Background
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Background;

        /**
         * Decodes a Background message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Background
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Background;

        /**
         * Verifies a Background message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Background message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Background
         */
        public static fromObject(object: { [k: string]: any }): clients.Background;

        /**
         * Creates a plain object from a Background message. Also converts values to other types if specified.
         * @param message Background
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Background, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Background to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChatContainer. */
    interface IChatContainer {

        /** ChatContainer context */
        context?: (clients.IChatContext|null);

        /** ChatContainer text */
        text?: (clients.IText|null);

        /** ChatContainer album */
        album?: (clients.IAlbum|null);

        /** ChatContainer contactCard */
        contactCard?: (clients.IContactCard|null);

        /** ChatContainer voiceNote */
        voiceNote?: (clients.IVoiceNote|null);

        /** ChatContainer files */
        files?: (clients.IFiles|null);

        /** ChatContainer reaction */
        reaction?: (clients.IReaction|null);

        /** ChatContainer location */
        location?: (clients.ILocation|null);
    }

    /** Represents a ChatContainer. */
    class ChatContainer implements IChatContainer {

        /**
         * Constructs a new ChatContainer.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IChatContainer);

        /** ChatContainer context. */
        public context?: (clients.IChatContext|null);

        /** ChatContainer text. */
        public text?: (clients.IText|null);

        /** ChatContainer album. */
        public album?: (clients.IAlbum|null);

        /** ChatContainer contactCard. */
        public contactCard?: (clients.IContactCard|null);

        /** ChatContainer voiceNote. */
        public voiceNote?: (clients.IVoiceNote|null);

        /** ChatContainer files. */
        public files?: (clients.IFiles|null);

        /** ChatContainer reaction. */
        public reaction?: (clients.IReaction|null);

        /** ChatContainer location. */
        public location?: (clients.ILocation|null);

        /** ChatContainer message. */
        public message?: ("text"|"album"|"contactCard"|"voiceNote"|"files"|"reaction"|"location");

        /**
         * Creates a new ChatContainer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatContainer instance
         */
        public static create(properties?: clients.IChatContainer): clients.ChatContainer;

        /**
         * Encodes the specified ChatContainer message. Does not implicitly {@link clients.ChatContainer.verify|verify} messages.
         * @param message ChatContainer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IChatContainer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatContainer message, length delimited. Does not implicitly {@link clients.ChatContainer.verify|verify} messages.
         * @param message ChatContainer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IChatContainer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatContainer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.ChatContainer;

        /**
         * Decodes a ChatContainer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.ChatContainer;

        /**
         * Verifies a ChatContainer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatContainer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatContainer
         */
        public static fromObject(object: { [k: string]: any }): clients.ChatContainer;

        /**
         * Creates a plain object from a ChatContainer message. Also converts values to other types if specified.
         * @param message ChatContainer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.ChatContainer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatContainer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ChatContext. */
    interface IChatContext {

        /** ChatContext feedPostId */
        feedPostId?: (string|null);

        /** ChatContext feedPostMediaIndex */
        feedPostMediaIndex?: (number|null);

        /** ChatContext chatReplyMessageId */
        chatReplyMessageId?: (string|null);

        /** ChatContext chatReplyMessageMediaIndex */
        chatReplyMessageMediaIndex?: (number|null);

        /** ChatContext chatReplyMessageSenderId */
        chatReplyMessageSenderId?: (string|null);
    }

    /** Represents a ChatContext. */
    class ChatContext implements IChatContext {

        /**
         * Constructs a new ChatContext.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IChatContext);

        /** ChatContext feedPostId. */
        public feedPostId: string;

        /** ChatContext feedPostMediaIndex. */
        public feedPostMediaIndex: number;

        /** ChatContext chatReplyMessageId. */
        public chatReplyMessageId: string;

        /** ChatContext chatReplyMessageMediaIndex. */
        public chatReplyMessageMediaIndex: number;

        /** ChatContext chatReplyMessageSenderId. */
        public chatReplyMessageSenderId: string;

        /**
         * Creates a new ChatContext instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ChatContext instance
         */
        public static create(properties?: clients.IChatContext): clients.ChatContext;

        /**
         * Encodes the specified ChatContext message. Does not implicitly {@link clients.ChatContext.verify|verify} messages.
         * @param message ChatContext message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IChatContext, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ChatContext message, length delimited. Does not implicitly {@link clients.ChatContext.verify|verify} messages.
         * @param message ChatContext message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IChatContext, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ChatContext message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ChatContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.ChatContext;

        /**
         * Decodes a ChatContext message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ChatContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.ChatContext;

        /**
         * Verifies a ChatContext message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ChatContext message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ChatContext
         */
        public static fromObject(object: { [k: string]: any }): clients.ChatContext;

        /**
         * Creates a plain object from a ChatContext message. Also converts values to other types if specified.
         * @param message ChatContext
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.ChatContext, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ChatContext to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PostContainer. */
    interface IPostContainer {

        /** PostContainer text */
        text?: (clients.IText|null);

        /** PostContainer album */
        album?: (clients.IAlbum|null);

        /** PostContainer voiceNote */
        voiceNote?: (clients.IVoiceNote|null);

        /** PostContainer moment */
        moment?: (clients.IMoment|null);

        /** PostContainer commentKey */
        commentKey?: (Uint8Array|null);
    }

    /** Represents a PostContainer. */
    class PostContainer implements IPostContainer {

        /**
         * Constructs a new PostContainer.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IPostContainer);

        /** PostContainer text. */
        public text?: (clients.IText|null);

        /** PostContainer album. */
        public album?: (clients.IAlbum|null);

        /** PostContainer voiceNote. */
        public voiceNote?: (clients.IVoiceNote|null);

        /** PostContainer moment. */
        public moment?: (clients.IMoment|null);

        /** PostContainer commentKey. */
        public commentKey: Uint8Array;

        /** PostContainer post. */
        public post?: ("text"|"album"|"voiceNote"|"moment");

        /**
         * Creates a new PostContainer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PostContainer instance
         */
        public static create(properties?: clients.IPostContainer): clients.PostContainer;

        /**
         * Encodes the specified PostContainer message. Does not implicitly {@link clients.PostContainer.verify|verify} messages.
         * @param message PostContainer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IPostContainer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PostContainer message, length delimited. Does not implicitly {@link clients.PostContainer.verify|verify} messages.
         * @param message PostContainer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IPostContainer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PostContainer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PostContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.PostContainer;

        /**
         * Decodes a PostContainer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PostContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.PostContainer;

        /**
         * Verifies a PostContainer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PostContainer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PostContainer
         */
        public static fromObject(object: { [k: string]: any }): clients.PostContainer;

        /**
         * Creates a plain object from a PostContainer message. Also converts values to other types if specified.
         * @param message PostContainer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.PostContainer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PostContainer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PostContainerBlob. */
    interface IPostContainerBlob {

        /** PostContainerBlob postContainer */
        postContainer?: (clients.IPostContainer|null);

        /** PostContainerBlob uid */
        uid?: (number|Long|null);

        /** PostContainerBlob postId */
        postId?: (string|null);

        /** PostContainerBlob timestamp */
        timestamp?: (number|Long|null);

        /** PostContainerBlob groupId */
        groupId?: (string|null);
    }

    /** Represents a PostContainerBlob. */
    class PostContainerBlob implements IPostContainerBlob {

        /**
         * Constructs a new PostContainerBlob.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IPostContainerBlob);

        /** PostContainerBlob postContainer. */
        public postContainer?: (clients.IPostContainer|null);

        /** PostContainerBlob uid. */
        public uid: (number|Long);

        /** PostContainerBlob postId. */
        public postId: string;

        /** PostContainerBlob timestamp. */
        public timestamp: (number|Long);

        /** PostContainerBlob groupId. */
        public groupId: string;

        /**
         * Creates a new PostContainerBlob instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PostContainerBlob instance
         */
        public static create(properties?: clients.IPostContainerBlob): clients.PostContainerBlob;

        /**
         * Encodes the specified PostContainerBlob message. Does not implicitly {@link clients.PostContainerBlob.verify|verify} messages.
         * @param message PostContainerBlob message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IPostContainerBlob, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PostContainerBlob message, length delimited. Does not implicitly {@link clients.PostContainerBlob.verify|verify} messages.
         * @param message PostContainerBlob message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IPostContainerBlob, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PostContainerBlob message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PostContainerBlob
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.PostContainerBlob;

        /**
         * Decodes a PostContainerBlob message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PostContainerBlob
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.PostContainerBlob;

        /**
         * Verifies a PostContainerBlob message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PostContainerBlob message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PostContainerBlob
         */
        public static fromObject(object: { [k: string]: any }): clients.PostContainerBlob;

        /**
         * Creates a plain object from a PostContainerBlob message. Also converts values to other types if specified.
         * @param message PostContainerBlob
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.PostContainerBlob, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PostContainerBlob to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CommentContainer. */
    interface ICommentContainer {

        /** CommentContainer context */
        context?: (clients.ICommentContext|null);

        /** CommentContainer text */
        text?: (clients.IText|null);

        /** CommentContainer album */
        album?: (clients.IAlbum|null);

        /** CommentContainer voiceNote */
        voiceNote?: (clients.IVoiceNote|null);

        /** CommentContainer reaction */
        reaction?: (clients.IReaction|null);
    }

    /** Represents a CommentContainer. */
    class CommentContainer implements ICommentContainer {

        /**
         * Constructs a new CommentContainer.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.ICommentContainer);

        /** CommentContainer context. */
        public context?: (clients.ICommentContext|null);

        /** CommentContainer text. */
        public text?: (clients.IText|null);

        /** CommentContainer album. */
        public album?: (clients.IAlbum|null);

        /** CommentContainer voiceNote. */
        public voiceNote?: (clients.IVoiceNote|null);

        /** CommentContainer reaction. */
        public reaction?: (clients.IReaction|null);

        /** CommentContainer comment. */
        public comment?: ("text"|"album"|"voiceNote"|"reaction");

        /**
         * Creates a new CommentContainer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CommentContainer instance
         */
        public static create(properties?: clients.ICommentContainer): clients.CommentContainer;

        /**
         * Encodes the specified CommentContainer message. Does not implicitly {@link clients.CommentContainer.verify|verify} messages.
         * @param message CommentContainer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.ICommentContainer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CommentContainer message, length delimited. Does not implicitly {@link clients.CommentContainer.verify|verify} messages.
         * @param message CommentContainer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.ICommentContainer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CommentContainer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CommentContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.CommentContainer;

        /**
         * Decodes a CommentContainer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CommentContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.CommentContainer;

        /**
         * Verifies a CommentContainer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CommentContainer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CommentContainer
         */
        public static fromObject(object: { [k: string]: any }): clients.CommentContainer;

        /**
         * Creates a plain object from a CommentContainer message. Also converts values to other types if specified.
         * @param message CommentContainer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.CommentContainer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CommentContainer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CommentContext. */
    interface ICommentContext {

        /** CommentContext feedPostId */
        feedPostId?: (string|null);

        /** CommentContext parentCommentId */
        parentCommentId?: (string|null);
    }

    /** Represents a CommentContext. */
    class CommentContext implements ICommentContext {

        /**
         * Constructs a new CommentContext.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.ICommentContext);

        /** CommentContext feedPostId. */
        public feedPostId: string;

        /** CommentContext parentCommentId. */
        public parentCommentId: string;

        /**
         * Creates a new CommentContext instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CommentContext instance
         */
        public static create(properties?: clients.ICommentContext): clients.CommentContext;

        /**
         * Encodes the specified CommentContext message. Does not implicitly {@link clients.CommentContext.verify|verify} messages.
         * @param message CommentContext message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.ICommentContext, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CommentContext message, length delimited. Does not implicitly {@link clients.CommentContext.verify|verify} messages.
         * @param message CommentContext message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.ICommentContext, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CommentContext message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CommentContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.CommentContext;

        /**
         * Decodes a CommentContext message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CommentContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.CommentContext;

        /**
         * Verifies a CommentContext message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CommentContext message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CommentContext
         */
        public static fromObject(object: { [k: string]: any }): clients.CommentContext;

        /**
         * Creates a plain object from a CommentContext message. Also converts values to other types if specified.
         * @param message CommentContext
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.CommentContext, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CommentContext to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Container. */
    interface IContainer {

        /** Container postContainer */
        postContainer?: (clients.IPostContainer|null);

        /** Container commentContainer */
        commentContainer?: (clients.ICommentContainer|null);

        /** Container chatContainer */
        chatContainer?: (clients.IChatContainer|null);
    }

    /** Represents a Container. */
    class Container implements IContainer {

        /**
         * Constructs a new Container.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IContainer);

        /** Container postContainer. */
        public postContainer?: (clients.IPostContainer|null);

        /** Container commentContainer. */
        public commentContainer?: (clients.ICommentContainer|null);

        /** Container chatContainer. */
        public chatContainer?: (clients.IChatContainer|null);

        /**
         * Creates a new Container instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Container instance
         */
        public static create(properties?: clients.IContainer): clients.Container;

        /**
         * Encodes the specified Container message. Does not implicitly {@link clients.Container.verify|verify} messages.
         * @param message Container message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IContainer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Container message, length delimited. Does not implicitly {@link clients.Container.verify|verify} messages.
         * @param message Container message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IContainer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Container message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Container
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Container;

        /**
         * Decodes a Container message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Container
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Container;

        /**
         * Verifies a Container message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Container message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Container
         */
        public static fromObject(object: { [k: string]: any }): clients.Container;

        /**
         * Creates a plain object from a Container message. Also converts values to other types if specified.
         * @param message Container
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Container, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Container to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Text. */
    interface IText {

        /** Text text */
        text?: (string|null);

        /** Text mentions */
        mentions?: (clients.IMention[]|null);

        /** Text link */
        link?: (clients.ILink|null);
    }

    /** Represents a Text. */
    class Text implements IText {

        /**
         * Constructs a new Text.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IText);

        /** Text text. */
        public text: string;

        /** Text mentions. */
        public mentions: clients.IMention[];

        /** Text link. */
        public link?: (clients.ILink|null);

        /**
         * Creates a new Text instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Text instance
         */
        public static create(properties?: clients.IText): clients.Text;

        /**
         * Encodes the specified Text message. Does not implicitly {@link clients.Text.verify|verify} messages.
         * @param message Text message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IText, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Text message, length delimited. Does not implicitly {@link clients.Text.verify|verify} messages.
         * @param message Text message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IText, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Text message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Text
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Text;

        /**
         * Decodes a Text message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Text
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Text;

        /**
         * Verifies a Text message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Text message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Text
         */
        public static fromObject(object: { [k: string]: any }): clients.Text;

        /**
         * Creates a plain object from a Text message. Also converts values to other types if specified.
         * @param message Text
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Text, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Text to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ContactCard. */
    interface IContactCard {

        /** ContactCard contacts */
        contacts?: (clients.IContact[]|null);
    }

    /** Represents a ContactCard. */
    class ContactCard implements IContactCard {

        /**
         * Constructs a new ContactCard.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IContactCard);

        /** ContactCard contacts. */
        public contacts: clients.IContact[];

        /**
         * Creates a new ContactCard instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContactCard instance
         */
        public static create(properties?: clients.IContactCard): clients.ContactCard;

        /**
         * Encodes the specified ContactCard message. Does not implicitly {@link clients.ContactCard.verify|verify} messages.
         * @param message ContactCard message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IContactCard, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ContactCard message, length delimited. Does not implicitly {@link clients.ContactCard.verify|verify} messages.
         * @param message ContactCard message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IContactCard, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ContactCard message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContactCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.ContactCard;

        /**
         * Decodes a ContactCard message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContactCard
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.ContactCard;

        /**
         * Verifies a ContactCard message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ContactCard message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContactCard
         */
        public static fromObject(object: { [k: string]: any }): clients.ContactCard;

        /**
         * Creates a plain object from a ContactCard message. Also converts values to other types if specified.
         * @param message ContactCard
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.ContactCard, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ContactCard to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Contact. */
    interface IContact {

        /** Contact name */
        name?: (string|null);

        /** Contact photo */
        photo?: (Uint8Array|null);

        /** Contact numbers */
        numbers?: (clients.IContactPhone[]|null);

        /** Contact emails */
        emails?: (clients.IContactEmail[]|null);

        /** Contact addresses */
        addresses?: (clients.IContactAddress[]|null);
    }

    /** Represents a Contact. */
    class Contact implements IContact {

        /**
         * Constructs a new Contact.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IContact);

        /** Contact name. */
        public name: string;

        /** Contact photo. */
        public photo: Uint8Array;

        /** Contact numbers. */
        public numbers: clients.IContactPhone[];

        /** Contact emails. */
        public emails: clients.IContactEmail[];

        /** Contact addresses. */
        public addresses: clients.IContactAddress[];

        /**
         * Creates a new Contact instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Contact instance
         */
        public static create(properties?: clients.IContact): clients.Contact;

        /**
         * Encodes the specified Contact message. Does not implicitly {@link clients.Contact.verify|verify} messages.
         * @param message Contact message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IContact, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Contact message, length delimited. Does not implicitly {@link clients.Contact.verify|verify} messages.
         * @param message Contact message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IContact, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Contact message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Contact
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Contact;

        /**
         * Decodes a Contact message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Contact
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Contact;

        /**
         * Verifies a Contact message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Contact message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Contact
         */
        public static fromObject(object: { [k: string]: any }): clients.Contact;

        /**
         * Creates a plain object from a Contact message. Also converts values to other types if specified.
         * @param message Contact
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Contact, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Contact to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ContactAddress. */
    interface IContactAddress {

        /** ContactAddress label */
        label?: (string|null);

        /** ContactAddress address */
        address?: (string|null);
    }

    /** Represents a ContactAddress. */
    class ContactAddress implements IContactAddress {

        /**
         * Constructs a new ContactAddress.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IContactAddress);

        /** ContactAddress label. */
        public label: string;

        /** ContactAddress address. */
        public address: string;

        /**
         * Creates a new ContactAddress instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContactAddress instance
         */
        public static create(properties?: clients.IContactAddress): clients.ContactAddress;

        /**
         * Encodes the specified ContactAddress message. Does not implicitly {@link clients.ContactAddress.verify|verify} messages.
         * @param message ContactAddress message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IContactAddress, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ContactAddress message, length delimited. Does not implicitly {@link clients.ContactAddress.verify|verify} messages.
         * @param message ContactAddress message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IContactAddress, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ContactAddress message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContactAddress
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.ContactAddress;

        /**
         * Decodes a ContactAddress message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContactAddress
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.ContactAddress;

        /**
         * Verifies a ContactAddress message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ContactAddress message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContactAddress
         */
        public static fromObject(object: { [k: string]: any }): clients.ContactAddress;

        /**
         * Creates a plain object from a ContactAddress message. Also converts values to other types if specified.
         * @param message ContactAddress
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.ContactAddress, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ContactAddress to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ContactEmail. */
    interface IContactEmail {

        /** ContactEmail label */
        label?: (string|null);

        /** ContactEmail address */
        address?: (string|null);
    }

    /** Represents a ContactEmail. */
    class ContactEmail implements IContactEmail {

        /**
         * Constructs a new ContactEmail.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IContactEmail);

        /** ContactEmail label. */
        public label: string;

        /** ContactEmail address. */
        public address: string;

        /**
         * Creates a new ContactEmail instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContactEmail instance
         */
        public static create(properties?: clients.IContactEmail): clients.ContactEmail;

        /**
         * Encodes the specified ContactEmail message. Does not implicitly {@link clients.ContactEmail.verify|verify} messages.
         * @param message ContactEmail message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IContactEmail, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ContactEmail message, length delimited. Does not implicitly {@link clients.ContactEmail.verify|verify} messages.
         * @param message ContactEmail message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IContactEmail, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ContactEmail message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContactEmail
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.ContactEmail;

        /**
         * Decodes a ContactEmail message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContactEmail
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.ContactEmail;

        /**
         * Verifies a ContactEmail message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ContactEmail message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContactEmail
         */
        public static fromObject(object: { [k: string]: any }): clients.ContactEmail;

        /**
         * Creates a plain object from a ContactEmail message. Also converts values to other types if specified.
         * @param message ContactEmail
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.ContactEmail, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ContactEmail to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ContactPhone. */
    interface IContactPhone {

        /** ContactPhone label */
        label?: (string|null);

        /** ContactPhone number */
        number?: (string|null);
    }

    /** Represents a ContactPhone. */
    class ContactPhone implements IContactPhone {

        /**
         * Constructs a new ContactPhone.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IContactPhone);

        /** ContactPhone label. */
        public label: string;

        /** ContactPhone number. */
        public number: string;

        /**
         * Creates a new ContactPhone instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContactPhone instance
         */
        public static create(properties?: clients.IContactPhone): clients.ContactPhone;

        /**
         * Encodes the specified ContactPhone message. Does not implicitly {@link clients.ContactPhone.verify|verify} messages.
         * @param message ContactPhone message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IContactPhone, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ContactPhone message, length delimited. Does not implicitly {@link clients.ContactPhone.verify|verify} messages.
         * @param message ContactPhone message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IContactPhone, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ContactPhone message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContactPhone
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.ContactPhone;

        /**
         * Decodes a ContactPhone message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContactPhone
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.ContactPhone;

        /**
         * Verifies a ContactPhone message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ContactPhone message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContactPhone
         */
        public static fromObject(object: { [k: string]: any }): clients.ContactPhone;

        /**
         * Creates a plain object from a ContactPhone message. Also converts values to other types if specified.
         * @param message ContactPhone
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.ContactPhone, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ContactPhone to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an Image. */
    interface IImage {

        /** Image img */
        img?: (clients.IEncryptedResource|null);

        /** Image width */
        width?: (number|null);

        /** Image height */
        height?: (number|null);
    }

    /** Represents an Image. */
    class Image implements IImage {

        /**
         * Constructs a new Image.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IImage);

        /** Image img. */
        public img?: (clients.IEncryptedResource|null);

        /** Image width. */
        public width: number;

        /** Image height. */
        public height: number;

        /**
         * Creates a new Image instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Image instance
         */
        public static create(properties?: clients.IImage): clients.Image;

        /**
         * Encodes the specified Image message. Does not implicitly {@link clients.Image.verify|verify} messages.
         * @param message Image message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IImage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Image message, length delimited. Does not implicitly {@link clients.Image.verify|verify} messages.
         * @param message Image message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IImage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Image message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Image
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Image;

        /**
         * Decodes an Image message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Image
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Image;

        /**
         * Verifies an Image message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Image message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Image
         */
        public static fromObject(object: { [k: string]: any }): clients.Image;

        /**
         * Creates a plain object from an Image message. Also converts values to other types if specified.
         * @param message Image
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Image, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Image to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a StreamingInfo. */
    interface IStreamingInfo {

        /** StreamingInfo blobVersion */
        blobVersion?: (clients.BlobVersion|null);

        /** StreamingInfo chunkSize */
        chunkSize?: (number|null);

        /** StreamingInfo blobSize */
        blobSize?: (number|Long|null);
    }

    /** Represents a StreamingInfo. */
    class StreamingInfo implements IStreamingInfo {

        /**
         * Constructs a new StreamingInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IStreamingInfo);

        /** StreamingInfo blobVersion. */
        public blobVersion: clients.BlobVersion;

        /** StreamingInfo chunkSize. */
        public chunkSize: number;

        /** StreamingInfo blobSize. */
        public blobSize: (number|Long);

        /**
         * Creates a new StreamingInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns StreamingInfo instance
         */
        public static create(properties?: clients.IStreamingInfo): clients.StreamingInfo;

        /**
         * Encodes the specified StreamingInfo message. Does not implicitly {@link clients.StreamingInfo.verify|verify} messages.
         * @param message StreamingInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IStreamingInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified StreamingInfo message, length delimited. Does not implicitly {@link clients.StreamingInfo.verify|verify} messages.
         * @param message StreamingInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IStreamingInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a StreamingInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns StreamingInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.StreamingInfo;

        /**
         * Decodes a StreamingInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns StreamingInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.StreamingInfo;

        /**
         * Verifies a StreamingInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a StreamingInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns StreamingInfo
         */
        public static fromObject(object: { [k: string]: any }): clients.StreamingInfo;

        /**
         * Creates a plain object from a StreamingInfo message. Also converts values to other types if specified.
         * @param message StreamingInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.StreamingInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this StreamingInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Video. */
    interface IVideo {

        /** Video video */
        video?: (clients.IEncryptedResource|null);

        /** Video width */
        width?: (number|null);

        /** Video height */
        height?: (number|null);

        /** Video streamingInfo */
        streamingInfo?: (clients.IStreamingInfo|null);
    }

    /** Represents a Video. */
    class Video implements IVideo {

        /**
         * Constructs a new Video.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IVideo);

        /** Video video. */
        public video?: (clients.IEncryptedResource|null);

        /** Video width. */
        public width: number;

        /** Video height. */
        public height: number;

        /** Video streamingInfo. */
        public streamingInfo?: (clients.IStreamingInfo|null);

        /**
         * Creates a new Video instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Video instance
         */
        public static create(properties?: clients.IVideo): clients.Video;

        /**
         * Encodes the specified Video message. Does not implicitly {@link clients.Video.verify|verify} messages.
         * @param message Video message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IVideo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Video message, length delimited. Does not implicitly {@link clients.Video.verify|verify} messages.
         * @param message Video message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IVideo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Video message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Video
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Video;

        /**
         * Decodes a Video message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Video
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Video;

        /**
         * Verifies a Video message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Video message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Video
         */
        public static fromObject(object: { [k: string]: any }): clients.Video;

        /**
         * Creates a plain object from a Video message. Also converts values to other types if specified.
         * @param message Video
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Video, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Video to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Files. */
    interface IFiles {

        /** Files files */
        files?: (clients.IFile[]|null);

        /** Files text */
        text?: (clients.IText|null);
    }

    /** Represents a Files. */
    class Files implements IFiles {

        /**
         * Constructs a new Files.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IFiles);

        /** Files files. */
        public files: clients.IFile[];

        /** Files text. */
        public text?: (clients.IText|null);

        /**
         * Creates a new Files instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Files instance
         */
        public static create(properties?: clients.IFiles): clients.Files;

        /**
         * Encodes the specified Files message. Does not implicitly {@link clients.Files.verify|verify} messages.
         * @param message Files message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IFiles, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Files message, length delimited. Does not implicitly {@link clients.Files.verify|verify} messages.
         * @param message Files message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IFiles, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Files message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Files
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Files;

        /**
         * Decodes a Files message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Files
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Files;

        /**
         * Verifies a Files message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Files message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Files
         */
        public static fromObject(object: { [k: string]: any }): clients.Files;

        /**
         * Creates a plain object from a Files message. Also converts values to other types if specified.
         * @param message Files
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Files, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Files to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a File. */
    interface IFile {

        /** File data */
        data?: (clients.IEncryptedResource|null);

        /** File filename */
        filename?: (string|null);
    }

    /** Represents a File. */
    class File implements IFile {

        /**
         * Constructs a new File.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IFile);

        /** File data. */
        public data?: (clients.IEncryptedResource|null);

        /** File filename. */
        public filename: string;

        /**
         * Creates a new File instance using the specified properties.
         * @param [properties] Properties to set
         * @returns File instance
         */
        public static create(properties?: clients.IFile): clients.File;

        /**
         * Encodes the specified File message. Does not implicitly {@link clients.File.verify|verify} messages.
         * @param message File message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IFile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified File message, length delimited. Does not implicitly {@link clients.File.verify|verify} messages.
         * @param message File message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IFile, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a File message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns File
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.File;

        /**
         * Decodes a File message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns File
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.File;

        /**
         * Verifies a File message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a File message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns File
         */
        public static fromObject(object: { [k: string]: any }): clients.File;

        /**
         * Creates a plain object from a File message. Also converts values to other types if specified.
         * @param message File
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.File, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this File to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Reaction. */
    interface IReaction {

        /** Reaction emoji */
        emoji?: (string|null);
    }

    /** Represents a Reaction. */
    class Reaction implements IReaction {

        /**
         * Constructs a new Reaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IReaction);

        /** Reaction emoji. */
        public emoji: string;

        /**
         * Creates a new Reaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Reaction instance
         */
        public static create(properties?: clients.IReaction): clients.Reaction;

        /**
         * Encodes the specified Reaction message. Does not implicitly {@link clients.Reaction.verify|verify} messages.
         * @param message Reaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IReaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Reaction message, length delimited. Does not implicitly {@link clients.Reaction.verify|verify} messages.
         * @param message Reaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IReaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Reaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Reaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Reaction;

        /**
         * Decodes a Reaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Reaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Reaction;

        /**
         * Verifies a Reaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Reaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Reaction
         */
        public static fromObject(object: { [k: string]: any }): clients.Reaction;

        /**
         * Creates a plain object from a Reaction message. Also converts values to other types if specified.
         * @param message Reaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Reaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Reaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Location. */
    interface ILocation {

        /** Location latitude */
        latitude?: (number|null);

        /** Location longitude */
        longitude?: (number|null);

        /** Location name */
        name?: (string|null);

        /** Location address */
        address?: (clients.IAddress|null);
    }

    /** Represents a Location. */
    class Location implements ILocation {

        /**
         * Constructs a new Location.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.ILocation);

        /** Location latitude. */
        public latitude: number;

        /** Location longitude. */
        public longitude: number;

        /** Location name. */
        public name: string;

        /** Location address. */
        public address?: (clients.IAddress|null);

        /**
         * Creates a new Location instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Location instance
         */
        public static create(properties?: clients.ILocation): clients.Location;

        /**
         * Encodes the specified Location message. Does not implicitly {@link clients.Location.verify|verify} messages.
         * @param message Location message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.ILocation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Location message, length delimited. Does not implicitly {@link clients.Location.verify|verify} messages.
         * @param message Location message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.ILocation, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Location message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Location
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Location;

        /**
         * Decodes a Location message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Location
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Location;

        /**
         * Verifies a Location message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Location message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Location
         */
        public static fromObject(object: { [k: string]: any }): clients.Location;

        /**
         * Creates a plain object from a Location message. Also converts values to other types if specified.
         * @param message Location
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Location, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Location to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an Address. */
    interface IAddress {

        /** Address formattedAddressLines */
        formattedAddressLines?: (string[]|null);
    }

    /** Represents an Address. */
    class Address implements IAddress {

        /**
         * Constructs a new Address.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IAddress);

        /** Address formattedAddressLines. */
        public formattedAddressLines: string[];

        /**
         * Creates a new Address instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Address instance
         */
        public static create(properties?: clients.IAddress): clients.Address;

        /**
         * Encodes the specified Address message. Does not implicitly {@link clients.Address.verify|verify} messages.
         * @param message Address message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IAddress, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Address message, length delimited. Does not implicitly {@link clients.Address.verify|verify} messages.
         * @param message Address message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IAddress, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Address message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Address
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Address;

        /**
         * Decodes an Address message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Address
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Address;

        /**
         * Verifies an Address message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Address message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Address
         */
        public static fromObject(object: { [k: string]: any }): clients.Address;

        /**
         * Creates a plain object from an Address message. Also converts values to other types if specified.
         * @param message Address
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Address, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Address to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AlbumMedia. */
    interface IAlbumMedia {

        /** AlbumMedia image */
        image?: (clients.IImage|null);

        /** AlbumMedia video */
        video?: (clients.IVideo|null);
    }

    /** Represents an AlbumMedia. */
    class AlbumMedia implements IAlbumMedia {

        /**
         * Constructs a new AlbumMedia.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IAlbumMedia);

        /** AlbumMedia image. */
        public image?: (clients.IImage|null);

        /** AlbumMedia video. */
        public video?: (clients.IVideo|null);

        /** AlbumMedia media. */
        public media?: ("image"|"video");

        /**
         * Creates a new AlbumMedia instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AlbumMedia instance
         */
        public static create(properties?: clients.IAlbumMedia): clients.AlbumMedia;

        /**
         * Encodes the specified AlbumMedia message. Does not implicitly {@link clients.AlbumMedia.verify|verify} messages.
         * @param message AlbumMedia message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IAlbumMedia, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AlbumMedia message, length delimited. Does not implicitly {@link clients.AlbumMedia.verify|verify} messages.
         * @param message AlbumMedia message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IAlbumMedia, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AlbumMedia message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AlbumMedia
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.AlbumMedia;

        /**
         * Decodes an AlbumMedia message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AlbumMedia
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.AlbumMedia;

        /**
         * Verifies an AlbumMedia message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AlbumMedia message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AlbumMedia
         */
        public static fromObject(object: { [k: string]: any }): clients.AlbumMedia;

        /**
         * Creates a plain object from an AlbumMedia message. Also converts values to other types if specified.
         * @param message AlbumMedia
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.AlbumMedia, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AlbumMedia to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an Album. */
    interface IAlbum {

        /** Album media */
        media?: (clients.IAlbumMedia[]|null);

        /** Album text */
        text?: (clients.IText|null);

        /** Album voiceNote */
        voiceNote?: (clients.IVoiceNote|null);
    }

    /** Represents an Album. */
    class Album implements IAlbum {

        /**
         * Constructs a new Album.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IAlbum);

        /** Album media. */
        public media: clients.IAlbumMedia[];

        /** Album text. */
        public text?: (clients.IText|null);

        /** Album voiceNote. */
        public voiceNote?: (clients.IVoiceNote|null);

        /**
         * Creates a new Album instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Album instance
         */
        public static create(properties?: clients.IAlbum): clients.Album;

        /**
         * Encodes the specified Album message. Does not implicitly {@link clients.Album.verify|verify} messages.
         * @param message Album message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IAlbum, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Album message, length delimited. Does not implicitly {@link clients.Album.verify|verify} messages.
         * @param message Album message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IAlbum, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an Album message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Album
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Album;

        /**
         * Decodes an Album message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Album
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Album;

        /**
         * Verifies an Album message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an Album message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Album
         */
        public static fromObject(object: { [k: string]: any }): clients.Album;

        /**
         * Creates a plain object from an Album message. Also converts values to other types if specified.
         * @param message Album
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Album, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Album to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SenderKey. */
    interface ISenderKey {

        /** SenderKey chainKey */
        chainKey?: (Uint8Array|null);

        /** SenderKey publicSignatureKey */
        publicSignatureKey?: (Uint8Array|null);
    }

    /** Represents a SenderKey. */
    class SenderKey implements ISenderKey {

        /**
         * Constructs a new SenderKey.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.ISenderKey);

        /** SenderKey chainKey. */
        public chainKey: Uint8Array;

        /** SenderKey publicSignatureKey. */
        public publicSignatureKey: Uint8Array;

        /**
         * Creates a new SenderKey instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SenderKey instance
         */
        public static create(properties?: clients.ISenderKey): clients.SenderKey;

        /**
         * Encodes the specified SenderKey message. Does not implicitly {@link clients.SenderKey.verify|verify} messages.
         * @param message SenderKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.ISenderKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SenderKey message, length delimited. Does not implicitly {@link clients.SenderKey.verify|verify} messages.
         * @param message SenderKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.ISenderKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SenderKey message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SenderKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.SenderKey;

        /**
         * Decodes a SenderKey message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SenderKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.SenderKey;

        /**
         * Verifies a SenderKey message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SenderKey message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SenderKey
         */
        public static fromObject(object: { [k: string]: any }): clients.SenderKey;

        /**
         * Creates a plain object from a SenderKey message. Also converts values to other types if specified.
         * @param message SenderKey
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.SenderKey, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SenderKey to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SenderState. */
    interface ISenderState {

        /** SenderState senderKey */
        senderKey?: (clients.ISenderKey|null);

        /** SenderState currentChainIndex */
        currentChainIndex?: (number|null);
    }

    /** Represents a SenderState. */
    class SenderState implements ISenderState {

        /**
         * Constructs a new SenderState.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.ISenderState);

        /** SenderState senderKey. */
        public senderKey?: (clients.ISenderKey|null);

        /** SenderState currentChainIndex. */
        public currentChainIndex: number;

        /**
         * Creates a new SenderState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SenderState instance
         */
        public static create(properties?: clients.ISenderState): clients.SenderState;

        /**
         * Encodes the specified SenderState message. Does not implicitly {@link clients.SenderState.verify|verify} messages.
         * @param message SenderState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.ISenderState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SenderState message, length delimited. Does not implicitly {@link clients.SenderState.verify|verify} messages.
         * @param message SenderState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.ISenderState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SenderState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SenderState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.SenderState;

        /**
         * Decodes a SenderState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SenderState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.SenderState;

        /**
         * Verifies a SenderState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SenderState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SenderState
         */
        public static fromObject(object: { [k: string]: any }): clients.SenderState;

        /**
         * Creates a plain object from a SenderState message. Also converts values to other types if specified.
         * @param message SenderState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.SenderState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SenderState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EncryptedPayload. */
    interface IEncryptedPayload {

        /** EncryptedPayload senderStateEncryptedPayload */
        senderStateEncryptedPayload?: (Uint8Array|null);

        /** EncryptedPayload oneToOneEncryptedPayload */
        oneToOneEncryptedPayload?: (Uint8Array|null);

        /** EncryptedPayload commentKeyEncryptedPayload */
        commentKeyEncryptedPayload?: (Uint8Array|null);
    }

    /** Represents an EncryptedPayload. */
    class EncryptedPayload implements IEncryptedPayload {

        /**
         * Constructs a new EncryptedPayload.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IEncryptedPayload);

        /** EncryptedPayload senderStateEncryptedPayload. */
        public senderStateEncryptedPayload?: (Uint8Array|null);

        /** EncryptedPayload oneToOneEncryptedPayload. */
        public oneToOneEncryptedPayload?: (Uint8Array|null);

        /** EncryptedPayload commentKeyEncryptedPayload. */
        public commentKeyEncryptedPayload?: (Uint8Array|null);

        /** EncryptedPayload payload. */
        public payload?: ("senderStateEncryptedPayload"|"oneToOneEncryptedPayload"|"commentKeyEncryptedPayload");

        /**
         * Creates a new EncryptedPayload instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EncryptedPayload instance
         */
        public static create(properties?: clients.IEncryptedPayload): clients.EncryptedPayload;

        /**
         * Encodes the specified EncryptedPayload message. Does not implicitly {@link clients.EncryptedPayload.verify|verify} messages.
         * @param message EncryptedPayload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IEncryptedPayload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EncryptedPayload message, length delimited. Does not implicitly {@link clients.EncryptedPayload.verify|verify} messages.
         * @param message EncryptedPayload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IEncryptedPayload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EncryptedPayload message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EncryptedPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.EncryptedPayload;

        /**
         * Decodes an EncryptedPayload message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EncryptedPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.EncryptedPayload;

        /**
         * Verifies an EncryptedPayload message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EncryptedPayload message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EncryptedPayload
         */
        public static fromObject(object: { [k: string]: any }): clients.EncryptedPayload;

        /**
         * Creates a plain object from an EncryptedPayload message. Also converts values to other types if specified.
         * @param message EncryptedPayload
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.EncryptedPayload, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EncryptedPayload to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Moment. */
    interface IMoment {

        /** Moment image */
        image?: (clients.IImage|null);
    }

    /** Represents a Moment. */
    class Moment implements IMoment {

        /**
         * Constructs a new Moment.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IMoment);

        /** Moment image. */
        public image?: (clients.IImage|null);

        /**
         * Creates a new Moment instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Moment instance
         */
        public static create(properties?: clients.IMoment): clients.Moment;

        /**
         * Encodes the specified Moment message. Does not implicitly {@link clients.Moment.verify|verify} messages.
         * @param message Moment message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IMoment, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Moment message, length delimited. Does not implicitly {@link clients.Moment.verify|verify} messages.
         * @param message Moment message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IMoment, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Moment message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Moment
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Moment;

        /**
         * Decodes a Moment message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Moment
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Moment;

        /**
         * Verifies a Moment message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Moment message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Moment
         */
        public static fromObject(object: { [k: string]: any }): clients.Moment;

        /**
         * Creates a plain object from a Moment message. Also converts values to other types if specified.
         * @param message Moment
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Moment, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Moment to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a VoiceNote. */
    interface IVoiceNote {

        /** VoiceNote audio */
        audio?: (clients.IEncryptedResource|null);
    }

    /** Represents a VoiceNote. */
    class VoiceNote implements IVoiceNote {

        /**
         * Constructs a new VoiceNote.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IVoiceNote);

        /** VoiceNote audio. */
        public audio?: (clients.IEncryptedResource|null);

        /**
         * Creates a new VoiceNote instance using the specified properties.
         * @param [properties] Properties to set
         * @returns VoiceNote instance
         */
        public static create(properties?: clients.IVoiceNote): clients.VoiceNote;

        /**
         * Encodes the specified VoiceNote message. Does not implicitly {@link clients.VoiceNote.verify|verify} messages.
         * @param message VoiceNote message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IVoiceNote, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified VoiceNote message, length delimited. Does not implicitly {@link clients.VoiceNote.verify|verify} messages.
         * @param message VoiceNote message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IVoiceNote, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a VoiceNote message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns VoiceNote
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.VoiceNote;

        /**
         * Decodes a VoiceNote message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns VoiceNote
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.VoiceNote;

        /**
         * Verifies a VoiceNote message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a VoiceNote message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns VoiceNote
         */
        public static fromObject(object: { [k: string]: any }): clients.VoiceNote;

        /**
         * Creates a plain object from a VoiceNote message. Also converts values to other types if specified.
         * @param message VoiceNote
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.VoiceNote, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this VoiceNote to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Link. */
    interface ILink {

        /** Link url */
        url?: (string|null);

        /** Link title */
        title?: (string|null);

        /** Link description */
        description?: (string|null);

        /** Link preview */
        preview?: (clients.IImage[]|null);
    }

    /** Represents a Link. */
    class Link implements ILink {

        /**
         * Constructs a new Link.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.ILink);

        /** Link url. */
        public url: string;

        /** Link title. */
        public title: string;

        /** Link description. */
        public description: string;

        /** Link preview. */
        public preview: clients.IImage[];

        /**
         * Creates a new Link instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Link instance
         */
        public static create(properties?: clients.ILink): clients.Link;

        /**
         * Encodes the specified Link message. Does not implicitly {@link clients.Link.verify|verify} messages.
         * @param message Link message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.ILink, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Link message, length delimited. Does not implicitly {@link clients.Link.verify|verify} messages.
         * @param message Link message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.ILink, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Link message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Link
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.Link;

        /**
         * Decodes a Link message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Link
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.Link;

        /**
         * Verifies a Link message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Link message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Link
         */
        public static fromObject(object: { [k: string]: any }): clients.Link;

        /**
         * Creates a plain object from a Link message. Also converts values to other types if specified.
         * @param message Link
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.Link, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Link to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MemberDetails. */
    interface IMemberDetails {

        /** MemberDetails uid */
        uid?: (number|Long|null);

        /** MemberDetails publicIdentityKey */
        publicIdentityKey?: (Uint8Array|null);
    }

    /** Represents a MemberDetails. */
    class MemberDetails implements IMemberDetails {

        /**
         * Constructs a new MemberDetails.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IMemberDetails);

        /** MemberDetails uid. */
        public uid: (number|Long);

        /** MemberDetails publicIdentityKey. */
        public publicIdentityKey: Uint8Array;

        /**
         * Creates a new MemberDetails instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MemberDetails instance
         */
        public static create(properties?: clients.IMemberDetails): clients.MemberDetails;

        /**
         * Encodes the specified MemberDetails message. Does not implicitly {@link clients.MemberDetails.verify|verify} messages.
         * @param message MemberDetails message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IMemberDetails, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MemberDetails message, length delimited. Does not implicitly {@link clients.MemberDetails.verify|verify} messages.
         * @param message MemberDetails message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IMemberDetails, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MemberDetails message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MemberDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.MemberDetails;

        /**
         * Decodes a MemberDetails message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MemberDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.MemberDetails;

        /**
         * Verifies a MemberDetails message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MemberDetails message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MemberDetails
         */
        public static fromObject(object: { [k: string]: any }): clients.MemberDetails;

        /**
         * Creates a plain object from a MemberDetails message. Also converts values to other types if specified.
         * @param message MemberDetails
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.MemberDetails, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MemberDetails to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PostIdContext. */
    interface IPostIdContext {

        /** PostIdContext feedPostId */
        feedPostId?: (string|null);

        /** PostIdContext senderUid */
        senderUid?: (number|Long|null);

        /** PostIdContext timestamp */
        timestamp?: (number|Long|null);
    }

    /** Represents a PostIdContext. */
    class PostIdContext implements IPostIdContext {

        /**
         * Constructs a new PostIdContext.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IPostIdContext);

        /** PostIdContext feedPostId. */
        public feedPostId: string;

        /** PostIdContext senderUid. */
        public senderUid: (number|Long);

        /** PostIdContext timestamp. */
        public timestamp: (number|Long);

        /**
         * Creates a new PostIdContext instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PostIdContext instance
         */
        public static create(properties?: clients.IPostIdContext): clients.PostIdContext;

        /**
         * Encodes the specified PostIdContext message. Does not implicitly {@link clients.PostIdContext.verify|verify} messages.
         * @param message PostIdContext message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IPostIdContext, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PostIdContext message, length delimited. Does not implicitly {@link clients.PostIdContext.verify|verify} messages.
         * @param message PostIdContext message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IPostIdContext, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PostIdContext message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PostIdContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.PostIdContext;

        /**
         * Decodes a PostIdContext message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PostIdContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.PostIdContext;

        /**
         * Verifies a PostIdContext message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PostIdContext message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PostIdContext
         */
        public static fromObject(object: { [k: string]: any }): clients.PostIdContext;

        /**
         * Creates a plain object from a PostIdContext message. Also converts values to other types if specified.
         * @param message PostIdContext
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.PostIdContext, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PostIdContext to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CommentIdContext. */
    interface ICommentIdContext {

        /** CommentIdContext commentId */
        commentId?: (string|null);

        /** CommentIdContext feedPostId */
        feedPostId?: (string|null);

        /** CommentIdContext parentCommentId */
        parentCommentId?: (string|null);

        /** CommentIdContext senderUid */
        senderUid?: (number|Long|null);

        /** CommentIdContext timestamp */
        timestamp?: (number|Long|null);
    }

    /** Represents a CommentIdContext. */
    class CommentIdContext implements ICommentIdContext {

        /**
         * Constructs a new CommentIdContext.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.ICommentIdContext);

        /** CommentIdContext commentId. */
        public commentId: string;

        /** CommentIdContext feedPostId. */
        public feedPostId: string;

        /** CommentIdContext parentCommentId. */
        public parentCommentId: string;

        /** CommentIdContext senderUid. */
        public senderUid: (number|Long);

        /** CommentIdContext timestamp. */
        public timestamp: (number|Long);

        /**
         * Creates a new CommentIdContext instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CommentIdContext instance
         */
        public static create(properties?: clients.ICommentIdContext): clients.CommentIdContext;

        /**
         * Encodes the specified CommentIdContext message. Does not implicitly {@link clients.CommentIdContext.verify|verify} messages.
         * @param message CommentIdContext message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.ICommentIdContext, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CommentIdContext message, length delimited. Does not implicitly {@link clients.CommentIdContext.verify|verify} messages.
         * @param message CommentIdContext message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.ICommentIdContext, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CommentIdContext message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CommentIdContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.CommentIdContext;

        /**
         * Decodes a CommentIdContext message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CommentIdContext
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.CommentIdContext;

        /**
         * Verifies a CommentIdContext message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CommentIdContext message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CommentIdContext
         */
        public static fromObject(object: { [k: string]: any }): clients.CommentIdContext;

        /**
         * Creates a plain object from a CommentIdContext message. Also converts values to other types if specified.
         * @param message CommentIdContext
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.CommentIdContext, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CommentIdContext to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ContentDetails. */
    interface IContentDetails {

        /** ContentDetails postIdContext */
        postIdContext?: (clients.IPostIdContext|null);

        /** ContentDetails commentIdContext */
        commentIdContext?: (clients.ICommentIdContext|null);

        /** ContentDetails contentHash */
        contentHash?: (Uint8Array|null);
    }

    /** Represents a ContentDetails. */
    class ContentDetails implements IContentDetails {

        /**
         * Constructs a new ContentDetails.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IContentDetails);

        /** ContentDetails postIdContext. */
        public postIdContext?: (clients.IPostIdContext|null);

        /** ContentDetails commentIdContext. */
        public commentIdContext?: (clients.ICommentIdContext|null);

        /** ContentDetails contentHash. */
        public contentHash: Uint8Array;

        /** ContentDetails contentId. */
        public contentId?: ("postIdContext"|"commentIdContext");

        /**
         * Creates a new ContentDetails instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContentDetails instance
         */
        public static create(properties?: clients.IContentDetails): clients.ContentDetails;

        /**
         * Encodes the specified ContentDetails message. Does not implicitly {@link clients.ContentDetails.verify|verify} messages.
         * @param message ContentDetails message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IContentDetails, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ContentDetails message, length delimited. Does not implicitly {@link clients.ContentDetails.verify|verify} messages.
         * @param message ContentDetails message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IContentDetails, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ContentDetails message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContentDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.ContentDetails;

        /**
         * Decodes a ContentDetails message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContentDetails
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.ContentDetails;

        /**
         * Verifies a ContentDetails message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ContentDetails message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContentDetails
         */
        public static fromObject(object: { [k: string]: any }): clients.ContentDetails;

        /**
         * Creates a plain object from a ContentDetails message. Also converts values to other types if specified.
         * @param message ContentDetails
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.ContentDetails, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ContentDetails to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GroupHistoryPayload. */
    interface IGroupHistoryPayload {

        /** GroupHistoryPayload memberDetails */
        memberDetails?: (clients.IMemberDetails[]|null);

        /** GroupHistoryPayload contentDetails */
        contentDetails?: (clients.IContentDetails[]|null);
    }

    /** Represents a GroupHistoryPayload. */
    class GroupHistoryPayload implements IGroupHistoryPayload {

        /**
         * Constructs a new GroupHistoryPayload.
         * @param [properties] Properties to set
         */
        constructor(properties?: clients.IGroupHistoryPayload);

        /** GroupHistoryPayload memberDetails. */
        public memberDetails: clients.IMemberDetails[];

        /** GroupHistoryPayload contentDetails. */
        public contentDetails: clients.IContentDetails[];

        /**
         * Creates a new GroupHistoryPayload instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GroupHistoryPayload instance
         */
        public static create(properties?: clients.IGroupHistoryPayload): clients.GroupHistoryPayload;

        /**
         * Encodes the specified GroupHistoryPayload message. Does not implicitly {@link clients.GroupHistoryPayload.verify|verify} messages.
         * @param message GroupHistoryPayload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: clients.IGroupHistoryPayload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GroupHistoryPayload message, length delimited. Does not implicitly {@link clients.GroupHistoryPayload.verify|verify} messages.
         * @param message GroupHistoryPayload message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: clients.IGroupHistoryPayload, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GroupHistoryPayload message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GroupHistoryPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): clients.GroupHistoryPayload;

        /**
         * Decodes a GroupHistoryPayload message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GroupHistoryPayload
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): clients.GroupHistoryPayload;

        /**
         * Verifies a GroupHistoryPayload message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GroupHistoryPayload message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GroupHistoryPayload
         */
        public static fromObject(object: { [k: string]: any }): clients.GroupHistoryPayload;

        /**
         * Creates a plain object from a GroupHistoryPayload message. Also converts values to other types if specified.
         * @param message GroupHistoryPayload
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: clients.GroupHistoryPayload, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GroupHistoryPayload to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
