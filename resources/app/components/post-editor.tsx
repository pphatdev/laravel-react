import React from 'react';
import YooptaEditor, {
    createYooptaEditor,
    Elements,
    Blocks,
    useYooptaEditor,
    YooptaContentValue,
    YooptaOnChangeOptions,
} from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import Accordion from '@yoopta/accordion';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import Table from '@yoopta/table';
import Divider from '@yoopta/divider';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';

import { useMemo, useRef, useState } from 'react';
import { WITH_BASIC_INIT_VALUE } from '@/data/example-post';
import { uploadToCloudinary } from '@/data/cloudinary';

const plugins = [
    Paragraph,
    Table,
    Divider.extend({
        elementProps: {
            divider: (props) => ({
                ...props,
                color: '#007aff',
            }),
        },
    }),
    Accordion,
    HeadingOne,
    HeadingTwo,
    HeadingThree,
    Blockquote,
    Callout,
    NumberedList,
    BulletedList,
    TodoList,
    Code,
    Link,
    Embed,
    Image.extend({
        options: {
            async onUpload(file) {
                const data = await uploadToCloudinary(file, 'image');

                return {
                    src: data.secure_url,
                    alt: 'cloudinary',
                    sizes: {
                        width: data.width,
                        height: data.height,
                    },
                };
            },
        },
    }),
    Video.extend({
        options: {
            onUpload: async (file) => {
                const data = await uploadToCloudinary(file, 'video');
                return {
                    src: data.secure_url,
                    alt: 'cloudinary',
                    sizes: {
                        width: data.width,
                        height: data.height,
                    },
                };
            },
            onUploadPoster: async (file) => {
                const image = await uploadToCloudinary(file, 'image');
                return image.secure_url;
            },
        },
    }),
    File.extend({
        options: {
            onUpload: async (file) => {
                const response = await uploadToCloudinary(file, 'auto');
                return { src: response.secure_url, format: response.format, name: response.name, size: response.bytes };
            },
        },
    }),
];

const TOOLS = {
    ActionMenu: {
        render: DefaultActionMenuRender,
        tool: ActionMenuList,
    },
    Toolbar: {
        render: DefaultToolbarRender,
        tool: Toolbar,
    },
    LinkTool: {
        render: DefaultLinkToolRender,
        tool: LinkTool,
    },
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

const PostEditor = () => {
    const [value, setValue] = useState(WITH_BASIC_INIT_VALUE);
    const editor = useMemo(() => createYooptaEditor(), []);
    const selectionRef = useRef(null);

    const onChange = (newValue: YooptaContentValue, options: YooptaOnChangeOptions) => {
        setValue(newValue);
    };

    return (
        <div
            className="w-full px-12 flex justify-center"
            ref={selectionRef}
        >
            <YooptaEditor
                editor={editor}
                plugins={plugins}
                tools={TOOLS}
                marks={MARKS}
                selectionBoxRoot={selectionRef}
                value={value}
                onChange={onChange}
                autoFocus
                className='!w-full max-w-3xl'
            />
        </div>
    );
}

export default PostEditor;