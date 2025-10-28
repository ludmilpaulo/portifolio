"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  FaBold, 
  FaItalic, 
  FaUnderline,
  FaList,
  FaListOl,
  FaHeading,
  FaLink,
  FaImage,
  FaCode,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaUndo,
  FaRedo
} from "react-icons/fa";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Start typing...",
  minHeight = "200px" 
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = value;
    }
  }, [value]);

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    const content = contentRef.current?.innerHTML || '';
    onChange(content);
  };

  const getSelection = () => {
    const selection = window.getSelection();
    return selection?.toString() || '';
  };

  const formatText = (format: string) => {
    switch (format) {
      case 'bold':
        executeCommand('bold');
        break;
      case 'italic':
        executeCommand('italic');
        break;
      case 'underline':
        executeCommand('underline');
        break;
      case 'h1':
        executeCommand('formatBlock', '<h1>');
        break;
      case 'h2':
        executeCommand('formatBlock', '<h2>');
        break;
      case 'h3':
        executeCommand('formatBlock', '<h3>');
        break;
      case 'ol':
        executeCommand('insertOrderedList');
        break;
      case 'ul':
        executeCommand('insertUnorderedList');
        break;
      case 'left':
        executeCommand('justifyLeft');
        break;
      case 'center':
        executeCommand('justifyCenter');
        break;
      case 'right':
        executeCommand('justifyRight');
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          executeCommand('createLink', url);
        }
        break;
      case 'image':
        const imgUrl = prompt('Enter image URL:');
        if (imgUrl) {
          executeCommand('insertImage', imgUrl);
        }
        break;
      case 'code':
        executeCommand('formatBlock', '<pre>');
        break;
      case 'undo':
        executeCommand('undo');
        break;
      case 'redo':
        executeCommand('redo');
        break;
    }
  };

  const handleInput = () => {
    const content = contentRef.current?.innerHTML || '';
    onChange(content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm"
    >
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap items-center gap-2">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => formatText('bold')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            <FaBold />
          </button>
          <button
            onClick={() => formatText('italic')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            <FaItalic />
          </button>
          <button
            onClick={() => formatText('underline')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            <FaUnderline />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => formatText('h1')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            <FaHeading />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => formatText('ul')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            <FaList />
          </button>
          <button
            onClick={() => formatText('ol')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            <FaListOl />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => formatText('left')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            <FaAlignLeft />
          </button>
          <button
            onClick={() => formatText('center')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            <FaAlignCenter />
          </button>
          <button
            onClick={() => formatText('right')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            <FaAlignRight />
          </button>
        </div>

        {/* Media */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2 mr-2">
          <button
            onClick={() => formatText('link')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            <FaLink />
          </button>
          <button
            onClick={() => formatText('image')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            <FaImage />
          </button>
          <button
            onClick={() => formatText('code')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            <FaCode />
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => formatText('undo')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            <FaUndo />
          </button>
          <button
            onClick={() => formatText('redo')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            type="button"
          >
            <FaRedo />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className="relative"
        style={{ minHeight }}
      >
        <div
          ref={contentRef}
          contentEditable
          onInput={handleInput}
          className="p-4 outline-none focus:ring-2 focus:ring-blue-500 rounded-b-lg"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
        {!value && (
          <div className="absolute inset-0 p-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RichTextEditor;

