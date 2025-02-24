import { FormProvider } from './container/context/FormBuilder';
import FormBuilderContainer from './container/FormBuilderContainer';

function App() {
  return (
    <FormProvider>
      <FormBuilderContainer />
    </FormProvider>
  );
}

export default App;
