import React from "react";
import {
    AutoComplete,
    AutoCompleteGroup,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import Router from "next/router";
import { Avatar } from "@chakra-ui/react";
import { FIND_ALL_USERNAMES } from "../pages/api/queries";
import { useQuery } from "@apollo/client";

// Search bar component
const Search = () => {
    const { data } = useQuery(FIND_ALL_USERNAMES)

    return (
        <AutoComplete rollNavigation>
            <AutoCompleteInput variant="filled" placeholder="Search..." autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter') Router.push(`/${e.currentTarget.value}`)
                }}
            />
            <AutoCompleteList>
                <AutoCompleteGroup title="Fruits" display="flex" justifyContent="center" alignItems="center" flexDirection="column" pb={0} showDivider

                >
                    {data?.findAllUsernames?.map((user: any, oid: any) => (
                        <AutoCompleteItem
                            key={`fruits-${oid}`}
                            value={user.username || ''}
                            textTransform="capitalize"
                            onClick={() => Router.push(`/${user.username}`)}
                            w="full"
                            mb={0}
                            fontSize="sm"
                        >
                            <Avatar size="sm" src={user.userImage} mr={5} />
                            {user.username || ''}
                        </AutoCompleteItem>
                    ))}
                </AutoCompleteGroup>
            </AutoCompleteList>
        </AutoComplete>
    );
};

export default Search
