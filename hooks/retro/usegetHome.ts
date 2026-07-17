import { getHomeData } from "@/api/retro-api"
import { useQuery } from "@tanstack/react-query"



export const useGetHome = () => {


    return useQuery({
        queryKey: ["home"],
        queryFn: getHomeData,
    })



}

