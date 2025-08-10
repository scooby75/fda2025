
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  itemClassName?: string;
}

export default function MultiSelect({ 
  options, 
  selected, 
  onChange, 
  placeholder = "Selecione...", 
  className, 
  itemClassName 
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item: string) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };
  
  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((item: string) => item !== value));
  };

  const displayValue = selected.length > 0 
    ? selected.map((val: string) => options.find((opt: MultiSelectOption) => opt.value === val)?.label || val).join(", ")
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild ref={triggerRef}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between text-sm text-foreground bg-input border-border hover:bg-muted/50 ${className}`}
        >
          <span className="truncate pr-2">
            {selected.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selected.map((value: string) => (
                  <Badge
                    key={value}
                    variant="secondary"
                    className="bg-primary/20 text-primary-foreground hover:bg-primary/30 px-2 py-0.5 text-xs"
                  >
                    {options.find((opt: MultiSelectOption) => opt.value === value)?.label || value}
                    <button 
                      onClick={(e: React.MouseEvent) => handleRemove(value, e)} 
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
                    >
                      <X className="h-3 w-3 text-primary-foreground hover:text-destructive-foreground" />
                    </button>
                  </Badge>
                ))}
                {selected.length === 0 && placeholder}
              </div>
            ) : (
              placeholder
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0 bg-popover border-border" 
        style={{ width: triggerRef.current ? `${triggerRef.current.offsetWidth}px` : 'auto' }}
        align="start"
      >
        <Command>
          <CommandInput placeholder="Procurar..." className="text-popover-foreground border-border focus:border-ring" style={{ color: 'rgb(15, 23, 42)' }} />
          <CommandList>
            <CommandEmpty className="text-popover-foreground" style={{ color: 'rgb(15, 23, 42)' }}>Nenhum item encontrado.</CommandEmpty>
            <CommandGroup>
              {options.map((option: MultiSelectOption) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    handleSelect(option.value);
                  }}
                  className={`text-popover-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground hover:bg-muted/50 ${itemClassName}`}
                  style={{ color: 'rgb(15, 23, 42)' }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selected.includes(option.value) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
