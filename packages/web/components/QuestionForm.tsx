import * as React from "react";
import { BlueInput, MyButton, Label, styled } from "@codeponder/ui";
import { DebounceInput } from "react-debounce-input";

import { CreateCodeReviewQuestionComponent } from "./apollo-components";
import { useInputValue } from "../utils/useInputValue";
import { wrapEditor } from "./commnetUI";
import { TextEditor, TextEditorResult } from "./CommentForm";

export interface QuestionFormProps {
  code?: string;
  path?: string;
  postId: string;
  programmingLanguage?: string;
  startLinesSelection: number;
  endLinesSelection: number;
  handleLinesSelection: (event: any, inputNumber: number) => void;
}

const FormRow = styled.div`
  padding: 1rem 2rem;
`;

export const QuestionForm = ({
  code,
  path,
  postId,
  programmingLanguage,
  startLinesSelection,
  endLinesSelection,
  handleLinesSelection,
}: QuestionFormProps) => {
  const [text, textChange] = useInputValue("");

  return (
    <CreateCodeReviewQuestionComponent>
      {mutate => (
        <form
          style={{
            background: "#FFFFFF",
            border: "1px solid #F2F2F2",
            borderRadius: "5px",
          }}
          onSubmit={async e => {
            e.preventDefault();
            const start = startLinesSelection;
            const end = endLinesSelection;
            const response = await mutate({
              variables: {
                codeReviewQuestion: {
                  startingLineNum: start,
                  endingLineNum: end,
                  codeSnippet: !code
                    ? null
                    : code
                        .split("\n")
                        .slice(start - 1, end)
                        .join("\n"),
                  text: text,
                  path,
                  postId,
                  programmingLanguage,
                },
              },
            });

            console.log(response);
          }}
        >
          {/* see https://www.npmjs.com/package/react-debounce-input */}
          <FormRow>
            <Label style={{ paddingBottom: ".4rem" }}>Line numbers</Label>
            <DebounceInput
              name="startingLineNum"
              placeholder="0"
              value={startLinesSelection}
              debounceTimeout={300}
              element={BlueInput}
              style={{ width: 33 }}
              onChange={ev => handleLinesSelection(ev, 0)}
            />
            <span style={{ padding: "0px 1rem" }}>–</span>
            <DebounceInput
              name="endingLineNum"
              placeholder="0"
              value={endLinesSelection}
              debounceTimeout={300}
              element={BlueInput}
              style={{ width: 33 }}
              onChange={ev => handleLinesSelection(ev, 1)}
            />
          </FormRow>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "#F2F2F2",
            }}
          />
          <FormRow>
            <Label style={{ paddingBottom: ".4rem" }}>Question</Label>
            <BlueInput
              name="question"
              placeholder="question"
              value={text}
              onChange={textChange}
              style={{ width: "100%", minHeight: 85 }}
              as="textarea"
            />
          </FormRow>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "#F2F2F2",
            }}
          />
          <div style={{ padding: "1rem", display: "flex" }}>
            <MyButton
              style={{ marginLeft: "auto" }}
              variant="primary"
              type="submit"
            >
              save
            </MyButton>
          </div>
        </form>
      )}
    </CreateCodeReviewQuestionComponent>
  );
};

// const WrappedTextEditor = wrapEditor(TextEditor);

// // TODO: fix type defenition
// export const QuestionForm = (
//   ChileComponent: (props: TextEditorProps) => JSX.Element
// ) => ({
//   code,
//   path,
//   postId,
//   programmingLanguage,
//   closeCommentEditor,
//   ...props
// }: QuestionProps) => (
//   <CreateCodeReviewQuestionComponent>
//     {mutate => {
//       const submitForm = async ({
//         cancel,
//         startingLineNum,
//         endingLineNum,
//         text,
//       }: TextEditorResult) => {
//         if (!cancel) {
//           // save result
//           const response = await mutate({
//             variables: {
//               codeReviewQuestion: {
//                 startingLineNum,
//                 endingLineNum,
//                 codeSnippet: !code
//                   ? null
//                   : code
//                       .split("\n")
//                       .slice(startingLineNum - 1, endingLineNum)
//                       .join("\n"),
//                 text: text,
//                 path,
//                 postId,
//                 programmingLanguage,
//               },
//             },
//           });
//           console.log(response);
//         }
//         closeCommentEditor();
//       };
//       return <ChileComponent {...{ ...props, submitForm }} />;
//     }}
//   </CreateCodeReviewQuestionComponent>
// );

// export interface QuestionProps {
export interface QuestionProps {
  isReplay: boolean;
  startingLineNum?: number; // not exist before the first commnet created
  endingLineNum: number;
  closeCommentEditor: Function;
  code?: string;
  path?: string;
  postId: string;
  programmingLanguage?: string;
}

const WrappedTextEditor = wrapEditor(TextEditor);

// TODO: fix type defenition
export const CreateQuestion = ({
  code,
  path,
  postId,
  programmingLanguage,
  closeCommentEditor,
  ...props
}: QuestionProps) => (
  <CreateCodeReviewQuestionComponent>
    {mutate => {
      const submitForm = async ({
        cancel,
        startingLineNum,
        endingLineNum,
        text,
      }: TextEditorResult) => {
        if (!cancel) {
          // save result
          const response = await mutate({
            variables: {
              codeReviewQuestion: {
                startingLineNum,
                endingLineNum,
                codeSnippet: !code
                  ? null
                  : code
                      .split("\n")
                      .slice(startingLineNum - 1, endingLineNum)
                      .join("\n"),
                text: text,
                path,
                postId,
                programmingLanguage,
              },
            },
          });
          console.log(response);
        }
        closeCommentEditor();
      };
      return <WrappedTextEditor {...{ ...props, submitForm }} />;
    }}
  </CreateCodeReviewQuestionComponent>
);
