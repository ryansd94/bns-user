import React, { useState, useEffect, useRef } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";
const MultiSelectText = React.memo(
  ({ control, field, required, data, label, name, placeholder }) => {
    const loadingPopup = useSelector((state) => state.master.loadingPopup);
    const [value, setValue] = React.useState([top100Films[13]]);
    const [text, setText] = React.useState("");
    const inputRef = useRef(null);
    const handleKeyDown = (event) => {
      switch (event.key) {
        case ",":
        case " ": {
          event.preventDefault();
          event.stopPropagation();
          if (event.target.value.length > 0) {
            setValue([...value, event.target.value]);
          }
          break;
        }
        default:
      }
    };

    const onTextChange = (e) => {
      if (e.target.value.indexOf("@") >= 0) {
        let bbbbb = e.target.value + "aaaaaaaa";

        setText(bbbbb);
      }
      setText(e.target.value);
    };

    const onTextKeypress = (e) => {
      if (e.key == "@" && e.target.value.indexOf("@") < 0) {
        e.target.value = e.target.value + "@gmail.com";
        // e.select();
        setText(e.target.value + "aaaaaaaa");
        e.preventDefault();
      }
    };
    const handleFocus = (e) => {
      inputRef.target.select();
    };

    return (
      <Controller
        name={name}
        render={({ field, fieldState: { error } }) =>
          loadingPopup ? (
            <Skeleton width={"100%"} height={"56px"} variant="text">
              <Autocomplete
                {...field}
                options={data}
                isOptionEqualToValue={(option, value) =>
                  option != null && value != null ? option.id === value.id : ""
                }
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required={required}
                    error={!!error}
                    helperText={error?.message}
                    label={label}
                    variant="outlined"
                  />
                )}
                onChange={(event, value) => field.onChange(value)}
              />
            </Skeleton>
          ) : (
            <Autocomplete
              {...field}
              multiple
              freeSolo
              options={[]}
              getOptionLabel={(option) => option.title || option}
              onChange={(event, newValue) => {
                field.onChange(newValue);
              }}
              fullWidth
              filterSelectedOptions
              renderInput={(params) => {
                params.inputProps.onKeyDown = handleKeyDown;
                return (
                  <TextField
                    {...params}
                    variant="outlined"
                    label={label}
                    placeholder={placeholder}
                    margin="normal"
                    fullWidth
                    // value={text}
                    // onFocus={handleFocus}
                    // ref={inputRef}
                    // onKeyDown={onTextKeypress}
                  ></TextField>
                );
              }}
            />
          )
        }
        control={control}
      />
    );
  },
);

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  { title: "The Lord of the Rings: The Return of the King", year: 2003 },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001 },
  { title: "Star Wars: Episode V - The Empire Strikes Back", year: 1980 },
  { title: "Forrest Gump", year: 1994 },
  { title: "Inception", year: 2010 },
  { title: "The Lord of the Rings: The Two Towers", year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: "Goodfellas", year: 1990 },
  { title: "The Matrix", year: 1999 },
  { title: "Seven Samurai", year: 1954 },
  { title: "Star Wars: Episode IV - A New Hope", year: 1977 },
  { title: "City of God", year: 2002 },
  { title: "Se7en", year: 1995 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "Life Is Beautiful", year: 1997 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Léon: The Professional", year: 1994 },
  { title: "Spirited Away", year: 2001 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "American History X", year: 1998 },
  { title: "Interstellar", year: 2014 },
  { title: "Casablanca", year: 1942 },
  { title: "City Lights", year: 1931 },
  { title: "Psycho", year: 1960 },
  { title: "The Green Mile", year: 1999 },
  { title: "The Intouchables", year: 2011 },
  { title: "Modern Times", year: 1936 },
  { title: "Raiders of the Lost Ark", year: 1981 },
  { title: "Rear Window", year: 1954 },
  { title: "The Pianist", year: 2002 },
  { title: "The Departed", year: 2006 },
  { title: "Terminator 2: Judgment Day", year: 1991 },
  { title: "Back to the Future", year: 1985 },
  { title: "Whiplash", year: 2014 },
  { title: "Gladiator", year: 2000 },
  { title: "Memento", year: 2000 },
  { title: "The Prestige", year: 2006 },
  { title: "The Lion King", year: 1994 },
  { title: "Apocalypse Now", year: 1979 },
  { title: "Alien", year: 1979 },
  { title: "Sunset Boulevard", year: 1950 },
  {
    title:
      "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    year: 1964,
  },
  { title: "The Great Dictator", year: 1940 },
  { title: "Cinema Paradiso", year: 1988 },
  { title: "The Lives of Others", year: 2006 },
  { title: "Grave of the Fireflies", year: 1988 },
  { title: "Paths of Glory", year: 1957 },
  { title: "Django Unchained", year: 2012 },
  { title: "The Shining", year: 1980 },
  { title: "WALL·E", year: 2008 },
  { title: "American Beauty", year: 1999 },
  { title: "The Dark Knight Rises", year: 2012 },
  { title: "Princess Mononoke", year: 1997 },
  { title: "Aliens", year: 1986 },
  { title: "Oldboy", year: 2003 },
  { title: "Once Upon a Time in America", year: 1984 },
  { title: "Witness for the Prosecution", year: 1957 },
  { title: "Das Boot", year: 1981 },
  { title: "Citizen Kane", year: 1941 },
  { title: "North by Northwest", year: 1959 },
  { title: "Vertigo", year: 1958 },
  { title: "Star Wars: Episode VI - Return of the Jedi", year: 1983 },
  { title: "Reservoir Dogs", year: 1992 },
  { title: "Braveheart", year: 1995 },
  { title: "M", year: 1931 },
  { title: "Requiem for a Dream", year: 2000 },
  { title: "Amélie", year: 2001 },
  { title: "A Clockwork Orange", year: 1971 },
  { title: "Like Stars on Earth", year: 2007 },
  { title: "Taxi Driver", year: 1976 },
  { title: "Lawrence of Arabia", year: 1962 },
  { title: "Double Indemnity", year: 1944 },
  { title: "Eternal Sunshine of the Spotless Mind", year: 2004 },
  { title: "Amadeus", year: 1984 },
  { title: "To Kill a Mockingbird", year: 1962 },
  { title: "Toy Story 3", year: 2010 },
  { title: "Logan", year: 2017 },
  { title: "Full Metal Jacket", year: 1987 },
  { title: "Dangal", year: 2016 },
  { title: "The Sting", year: 1973 },
  { title: "2001: A Space Odyssey", year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: "Toy Story", year: 1995 },
  { title: "Bicycle Thieves", year: 1948 },
  { title: "The Kid", year: 1921 },
  { title: "Inglourious Basterds", year: 2009 },
  { title: "Snatch", year: 2000 },
  { title: "3 Idiots", year: 2009 },
  { title: "Monty Python and the Holy Grail", year: 1975 },
];

export default MultiSelectText;
