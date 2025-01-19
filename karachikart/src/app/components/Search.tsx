import Form from "next/form";
import FormReset from './FormReset';
import { SearchIcon } from "lucide-react";

const SeachForm = ({query}: {query?: string}) => {
  return (
    <Form action="/" scroll={false} className="search-form">
      <input
        name="query"
        placeholder="Search for ideas"
        className="search-input"
        defaultValue={query}
         spellCheck="false"
         data-ms-editor="true"
      />

      <div className="flex gap-2">
        {query && <FormReset />}

        <button type="submit" className="search-btn">
            <SearchIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </Form>
  );
};

export default SeachForm;