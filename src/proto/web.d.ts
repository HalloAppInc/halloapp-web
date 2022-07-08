import * as $protobuf from "protobufjs";
/** Namespace web. */
export namespace web {

    /** Properties of a WebContainer. */
    interface IWebContainer {

        /** WebContainer noiseMessage */
        noiseMessage?: (web.INoiseMessage|null);
    }

    /** Represents a WebContainer. */
    class WebContainer implements IWebContainer {

        /**
         * Constructs a new WebContainer.
         * @param [properties] Properties to set
         */
        constructor(properties?: web.IWebContainer);

        /** WebContainer noiseMessage. */
        public noiseMessage?: (web.INoiseMessage|null);

        /** WebContainer payload. */
        public payload?: "noiseMessage";

        /**
         * Creates a new WebContainer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WebContainer instance
         */
        public static create(properties?: web.IWebContainer): web.WebContainer;

        /**
         * Encodes the specified WebContainer message. Does not implicitly {@link web.WebContainer.verify|verify} messages.
         * @param message WebContainer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: web.IWebContainer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WebContainer message, length delimited. Does not implicitly {@link web.WebContainer.verify|verify} messages.
         * @param message WebContainer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: web.IWebContainer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WebContainer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WebContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): web.WebContainer;

        /**
         * Decodes a WebContainer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WebContainer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): web.WebContainer;

        /**
         * Verifies a WebContainer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WebContainer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WebContainer
         */
        public static fromObject(object: { [k: string]: any }): web.WebContainer;

        /**
         * Creates a plain object from a WebContainer message. Also converts values to other types if specified.
         * @param message WebContainer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: web.WebContainer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WebContainer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a NoiseMessage. */
    interface INoiseMessage {

        /** NoiseMessage messageType */
        messageType?: (web.NoiseMessage.MessageType|null);

        /** NoiseMessage content */
        content?: (Uint8Array|null);
    }

    /** Represents a NoiseMessage. */
    class NoiseMessage implements INoiseMessage {

        /**
         * Constructs a new NoiseMessage.
         * @param [properties] Properties to set
         */
        constructor(properties?: web.INoiseMessage);

        /** NoiseMessage messageType. */
        public messageType: web.NoiseMessage.MessageType;

        /** NoiseMessage content. */
        public content: Uint8Array;

        /**
         * Creates a new NoiseMessage instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NoiseMessage instance
         */
        public static create(properties?: web.INoiseMessage): web.NoiseMessage;

        /**
         * Encodes the specified NoiseMessage message. Does not implicitly {@link web.NoiseMessage.verify|verify} messages.
         * @param message NoiseMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: web.INoiseMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NoiseMessage message, length delimited. Does not implicitly {@link web.NoiseMessage.verify|verify} messages.
         * @param message NoiseMessage message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: web.INoiseMessage, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NoiseMessage message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NoiseMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): web.NoiseMessage;

        /**
         * Decodes a NoiseMessage message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NoiseMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): web.NoiseMessage;

        /**
         * Verifies a NoiseMessage message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NoiseMessage message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NoiseMessage
         */
        public static fromObject(object: { [k: string]: any }): web.NoiseMessage;

        /**
         * Creates a plain object from a NoiseMessage message. Also converts values to other types if specified.
         * @param message NoiseMessage
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: web.NoiseMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NoiseMessage to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace NoiseMessage {

        /** MessageType enum. */
        enum MessageType {
            IK_A = 0,
            IK_B = 1,
            KK_A = 2,
            KK_B = 3
        }
    }
}
