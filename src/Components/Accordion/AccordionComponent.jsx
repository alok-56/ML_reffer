import React, { useState } from "react";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";

function AccordionComponent({ accordionData, userRole }) {
  const [open, setOpen] = useState("");

  const toggle = (id) => {
    if (open === id) {
      setOpen("");
    } else {
      setOpen(id);
    }
  };

  return (
    <div>
      <Accordion flush open={open} toggle={toggle}>
        {accordionData.map((item, index) => {
          // Check if the user has access to this accordion item based on role
          if (item.roles && !item.roles.includes(userRole)) {
            return null; // If no access, skip rendering this item
          }

          return (
            <AccordionItem key={index}>
              <AccordionHeader targetId={item.id}>{item.title}</AccordionHeader>
              <AccordionBody accordionId={item.id}>
                {/* Dynamically render the component passed in the item */}
                {item.component && <item.component />}
              </AccordionBody>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

export default AccordionComponent;
