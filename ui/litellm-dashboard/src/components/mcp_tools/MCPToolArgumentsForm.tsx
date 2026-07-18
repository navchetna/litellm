import { forwardRef, useImperativeHandle } from "react";

export interface MCPToolArgumentsFormRef {
  getSubmitValues: () => Promise<Record<string, any>>;
}

interface MCPToolArgumentsFormProps {
  tool?: any;
  className?: string;
}

const MCPToolArgumentsForm = forwardRef<MCPToolArgumentsFormRef, MCPToolArgumentsFormProps>((props, ref) => {
  useImperativeHandle(ref, () => ({
    getSubmitValues: async () => ({}),
  }));

  return null;
});

MCPToolArgumentsForm.displayName = "MCPToolArgumentsForm";

export default MCPToolArgumentsForm;
