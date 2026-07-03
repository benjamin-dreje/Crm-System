// crm layout

import Sidebar from "../crm/component/navbar/page"; // ודא שהנתיב לקומפוננט שלך נכון
import  QueryProvider  from "../../provider/queryProvider";

export default function CrmLayout({ children }) {
  return (
    <QueryProvider>
      <div className="crm-layout">
        {/* הסיידבר קבוע בצד שמאל */}
        <Sidebar />

        {/* אזור התוכן הראשי שיקבל את המרווח הנכון */}
        <main className="crm-main-content">{children}</main>
      </div>
    </QueryProvider>
  );
}
