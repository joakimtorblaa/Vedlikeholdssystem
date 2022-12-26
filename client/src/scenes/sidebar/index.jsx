import { useState } from 'react';
import {
    Box,
    IconButton,
    Typography,
    Divider,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    GroupOutlined,
    GroupsOutlined,
    GroupAddOutlined,
    PersonAddOutlined,
    TaskOutlined,
    LocationOnOutlined,
    AddLocationOutlined,
    Menu,
    Close,
    LogoutOutlined,
    HomeOutlined,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout} from '../../state';
import { useNavigate } from 'react-router-dom';
import FlexBetween from '../../components/FlexBetween';
import UserImage from '../../components/UserImage';
import { useEffect } from 'react';
import useWindowSize from '../../hooks/useWindowSize';

const Sidebar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const userId = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const windowSize = useWindowSize();
    const newSize = windowSize.height - 400;
    const newSizeMobile = windowSize.height - 440;

    const theme = useTheme();

    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    const getUser = async () => {
        const response = await fetch(`${process.env.REACT_APP_DEVELOPMENT_DATABASE_URL}/users/${userId}`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);

    }
    useEffect(() => {
        getUser();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) {
        return null;
    }

    const {
        fullName,
        picturePath,
        role
    } = user;

    return (

        <Box>
            {isNonMobileScreens ? (
            <Box
                position="fixed"
                height="100vh"
                min-width="300px" 
                left="0"
                bottom="0"
                zIndex="10"
                backgroundColor={alt}
                padding="1rem 0"
            >
                
                <FlexBetween
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >   
                    <Typography
                        fontWeight="bold"
                        fontSize="clamp(1rem, 1.5rem, 2rem)"
                        color="primary"
                        onClick={() => navigate("/admin/dashboard")}
                        sx={{
                            "&:hover": {
                                color: primaryLight,
                                cursor: "pointer"
                            }
                        }}
                    >
                        Admin panel
                    </Typography>
                <Divider sx={{ margin: "1.25rem 0" }} />
                    <UserImage image={picturePath} size="140px"/>
                    <Typography
                        fontWeight="bold"
                        fontSize="clamp(0.75rem, 1.25rem, 1.75rem)"
                    >
                        {fullName}
                    </Typography>
                    <Typography>
                        {role}
                    </Typography>
                <Divider sx={{ margin: "1.25rem 0" }} />
                <Box sx={{
                    overflow:"auto",
                    height: newSize,
                    }}>
                    {/* User */}
                    <Box
                        width="100%"
                        display="flex"
                        padding="1rem 3rem 0.5rem 3rem"
                    >
                        
                        <Typography fontWeight="bold">
                            User management
                        </Typography>
                    </Box>
                    <Box
                        width="100%"
                        display="flex"
                        padding="0.5rem 3rem"
                        sx={{
                            "&:hover": {
                                color: primaryLight,
                                backgroundColor: background,
                                cursor: "pointer"
                                
                            }
                        }}
                    >
                        <GroupOutlined/>
                        <Typography paddingLeft="10px">
                        Manage users
                        </Typography>
                    </Box>
                    <Box
                        width="100%"
                        display="flex"
                        padding="0.5rem 3rem"
                        onClick={() => navigate("/admin/register")}
                        sx={{
                            "&:hover": {
                                color: primaryLight,
                                backgroundColor: background,
                                cursor: "pointer"
                            }
                        }}
                    >
                        <PersonAddOutlined/>
                        <Typography paddingLeft="10px">
                            New user
                        </Typography>
                    </Box>
                    {/* Location */}
                    <Divider/>
                    <Box
                        width="100%"
                        display="flex"
                        padding="1rem 3rem 0.5rem 3rem"
                    >
                        <Typography fontWeight="bold">
                            Location management
                        </Typography>
                    </Box>
                    <Box
                        width="100%"
                        display="flex"
                        padding="0.5rem 3rem"
                        sx={{
                            "&:hover": {
                                color: primaryLight,
                                backgroundColor: background,
                                cursor: "pointer"
                                
                            }
                        }}
                    >
                        <LocationOnOutlined/>
                        <Typography paddingLeft="10px">
                            Manage locations
                        </Typography>
                    </Box>
                    <Box
                        width="100%"
                        display="flex"
                        padding="0.5rem 3rem"
                        onClick={() => navigate("/admin/locations/new")}
                        sx={{
                            "&:hover": {
                                color: primaryLight,
                                backgroundColor: background,
                                cursor: "pointer"
                                
                            }
                        }}
                    >
                        <AddLocationOutlined/>
                        <Typography paddingLeft="10px">
                            New location
                        </Typography>
                    </Box>
                    {/* Task */}
                    <Divider/>
                    <Box
                        width="100%"
                        display="flex"
                        padding="1rem 3rem 0.5rem 3rem"
                    >
                        <Typography fontWeight="bold">
                            Task management
                        </Typography>
                    </Box>
                    <Box
                        width="100%"
                        display="flex"
                        padding="0.5rem 3rem"
                        sx={{
                            "&:hover": {
                                color: primaryLight,
                                backgroundColor: background,
                                cursor: "pointer"
                                
                            }
                        }}
                    >
                        <TaskOutlined/>
                        <Typography paddingLeft="10px">
                            Manage tasks
                        </Typography>
                    </Box>
                    {/* Location */}
                    <Divider/>
                    <Box
                        width="100%"
                        display="flex"
                        padding="1rem 3rem 0.5rem 3rem"
                    >
                        <Typography fontWeight="bold">
                            Team management
                        </Typography>
                    </Box>
                    <Box
                        width="100%"
                        display="flex"
                        padding="0.5rem 3rem"
                        sx={{
                            "&:hover": {
                                color: primaryLight,
                                backgroundColor: background,
                                cursor: "pointer"
                                
                            }
                        }}
                    >
                        <GroupsOutlined/>
                        <Typography paddingLeft="10px">
                            Manage teams
                        </Typography>
                    </Box>
                    <Box
                        width="100%"
                        display="flex"
                        padding="0.5rem 3rem"
                        sx={{
                            "&:hover": {
                                color: primaryLight,
                                backgroundColor: background,
                                cursor: "pointer"
                                
                            }
                        }}
                    >
                        <GroupAddOutlined/>
                        <Typography paddingLeft="10px">
                            New team
                        </Typography>
                    </Box>
                    <FlexBetween padding="1rem 2.5rem" width="100%" position="absolute" bottom="0">
                        <IconButton onClick={() => navigate("/home")}>
                            <HomeOutlined />
                        </IconButton>
                        <IconButton  onClick={() => dispatch(setLogout())}>
                            <LogoutOutlined />
                        </IconButton>
                    </FlexBetween>
                </Box>
                </FlexBetween> 
                   
            </Box>
            ) : (
            <Box padding="1rem">
                <IconButton
                    onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                >
                    <Menu />
                </IconButton>
            </Box>
            
            )}
            {/* MOBILE SCREENS */}
            {!isNonMobileScreens && isMobileMenuToggled && (
               <Box
                    position="fixed"
                    height="100vh"
                    min-width="300px" 
                    left="0"
                    bottom="0"
                    zIndex="10"
                    backgroundColor={alt}
                    padding="1rem 0"
                >
                <Box display="flex" justifyContent="flex-start" p="0.2rem 1rem">
                        <IconButton
                            onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
                            >
                            <Close />
                        </IconButton>
                    </Box>    
                    <FlexBetween
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                    >   
                    
                        <Typography
                            fontWeight="bold"
                            fontSize="clamp(1rem, 1.5rem, 2rem)"
                            color="primary"
                            onClick={() => navigate("/admin")}
                            sx={{
                                "&:hover": {
                                    color: primaryLight,
                                    cursor: "pointer"
                                }
                            }}
                        >
                            Admin panel
                        </Typography>
                    <Divider sx={{ margin: "1.25rem 0" }} />
                        <UserImage image={picturePath} size="140px"/>
                        <Typography
                            fontWeight="bold"
                            fontSize="clamp(0.75rem, 1.25rem, 1.75rem)"
                        >
                            {fullName}
                        </Typography>
                        <Typography>
                            {role}
                        </Typography>
                    <Divider sx={{ margin: "1.25rem 0" }} />
                    <Box sx={{
                        overflow:"auto",
                        height: newSizeMobile,
                        }}>
                        {/* User */}
                        <Box
                            width="100%"
                            display="flex"
                            padding="1rem 3rem 0.5rem 3rem"
                        >
                            
                            <Typography fontWeight="bold">
                                User management
                            </Typography>
                        </Box>
                        <Box
                            width="100%"
                            display="flex"
                            padding="0.5rem 3rem"
                            sx={{
                                "&:hover": {
                                    color: primaryLight,
                                    backgroundColor: background,
                                    cursor: "pointer"
                                    
                                }
                            }}
                        >
                            <GroupOutlined/>
                            <Typography paddingLeft="10px">
                            Manage users
                            </Typography>
                        </Box>
                        <Box
                            width="100%"
                            display="flex"
                            padding="0.5rem 3rem"
                            onClick={() => navigate("/admin/register")}
                            sx={{
                                "&:hover": {
                                    color: primaryLight,
                                    backgroundColor: background,
                                    cursor: "pointer"
                                }
                            }}
                        >
                            <PersonAddOutlined/>
                            <Typography paddingLeft="10px">
                                New user
                            </Typography>
                        </Box>
                        {/* Location */}
                        <Divider/>
                        <Box
                            width="100%"
                            display="flex"
                            padding="1rem 3rem 0.5rem 3rem"
                        >
                            <Typography fontWeight="bold">
                                Location management
                            </Typography>
                        </Box>
                        <Box
                            width="100%"
                            display="flex"
                            padding="0.5rem 3rem"
                            sx={{
                                "&:hover": {
                                    color: primaryLight,
                                    backgroundColor: background,
                                    cursor: "pointer"
                                    
                                }
                            }}
                        >
                            <LocationOnOutlined/>
                            <Typography paddingLeft="10px">
                                Manage locations
                            </Typography>
                        </Box>
                        <Box
                            width="100%"
                            display="flex"
                            padding="0.5rem 3rem"
                            sx={{
                                "&:hover": {
                                    color: primaryLight,
                                    backgroundColor: background,
                                    cursor: "pointer"
                                    
                                }
                            }}
                        >
                            <AddLocationOutlined/>
                            <Typography paddingLeft="10px">
                                New location
                            </Typography>
                        </Box>
                        {/* Task */}
                        <Divider/>
                        <Box
                            width="100%"
                            display="flex"
                            padding="1rem 3rem 0.5rem 3rem"
                        >
                            <Typography fontWeight="bold">
                                Task management
                            </Typography>
                        </Box>
                        <Box
                            width="100%"
                            display="flex"
                            padding="0.5rem 3rem"
                            sx={{
                                "&:hover": {
                                    color: primaryLight,
                                    backgroundColor: background,
                                    cursor: "pointer"
                                    
                                }
                            }}
                        >
                            <TaskOutlined/>
                            <Typography paddingLeft="10px">
                                Manage tasks
                            </Typography>
                        </Box>
                        {/* Location */}
                        <Divider/>
                        <Box
                            width="100%"
                            display="flex"
                            padding="1rem 3rem 0.5rem 3rem"
                        >
                            <Typography fontWeight="bold">
                                Team management
                            </Typography>
                        </Box>
                        <Box
                            width="100%"
                            display="flex"
                            padding="0.5rem 3rem"
                            sx={{
                                "&:hover": {
                                    color: primaryLight,
                                    backgroundColor: background,
                                    cursor: "pointer"
                                    
                                }
                            }}
                        >
                            <GroupsOutlined/>
                            <Typography paddingLeft="10px">
                                Manage teams
                            </Typography>
                        </Box>
                        <Box
                            width="100%"
                            display="flex"
                            padding="0.5rem 3rem"
                            sx={{
                                "&:hover": {
                                    color: primaryLight,
                                    backgroundColor: background,
                                    cursor: "pointer"
                                    
                                }
                            }}
                        >
                            <GroupAddOutlined/>
                            <Typography paddingLeft="10px">
                                New team
                            </Typography>
                        </Box>
                        <FlexBetween padding="1rem 2.5rem" width="100%" position="absolute" bottom="0">
                            <IconButton onClick={() => navigate("/home")}>
                                <HomeOutlined />
                            </IconButton>
                            <IconButton onClick={() => dispatch(setLogout())}>
                                <LogoutOutlined />
                            </IconButton>
                        </FlexBetween>
                    </Box>
                </FlexBetween>        
           </Box> 
            )}
            
        </Box>
    )

}

export default Sidebar;