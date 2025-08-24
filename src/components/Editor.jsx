import PersonalEditor from "./PersonalEditor";
import EditorEducation from "./EditorEducation";
import EditorExperience from "./EditorExperience";
import EditorProjects from "./EditorProjects";
import EditorSkills from "./EditorSkills";

export default function Editor() {
  return (
    <div>
      <PersonalEditor />
      <EditorEducation />
      <EditorExperience />
      <EditorSkills />
      <EditorProjects />
    </div>
  );
}
